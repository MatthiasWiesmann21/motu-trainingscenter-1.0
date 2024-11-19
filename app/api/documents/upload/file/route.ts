
import createFolder from "@/app/vendor/aws/s3/createFolder";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getS3Client } from "@/app/vendor/aws/s3/getS3Client";
import { Upload } from "@aws-sdk/lib-storage";
import { NextApiResponse } from "next";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const getOrCreateParentFolder = async (userId: string, parentKey?: string | null) => {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  if (parentKey != null) {
    const parentFolder = await db.folder.findFirst({
      where: {
        key: parentKey,
        userId: userId,
        containerId: session?.user?.profile?.containerId,
      },
    });
    if (parentFolder == null) {
      throw new Error("Parent Folder Not Found");
    }
    return parentFolder;
  }

  // Check if root folder exists
  let rootFolder = await db.folder.findFirst({
    where: {
      parentFolder: null,
      userId: userId,
      containerId: session?.user?.profile?.containerId,
    },
  });
  if (rootFolder == null) {
    // Create a root folder in S3 and add its path to db
    const key = `${userId}-root/`; // Adding slash at the end of key it will make a folder
    await createFolder(key);

    rootFolder = await db.folder.create({
      data: {
        name: key,
        key: key,
        isPublic: false,
        userId: userId,
        containerId: session?.user?.profile?.containerId,
      },
    });
  }

  return rootFolder;
};

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (userId == null) {
      throw new Error("Unauthorized");
    }

    const formData = await req.formData();

    const formFile: any = formData.get("file");
    const fileExtension = formFile.name.split(".").pop();
    const formIsPublic = formData.get("isPublic");
    const formFileName = formData.get("name");
    const isPublic =
      typeof formIsPublic === "string"
        ? formIsPublic === "true"
          ? true
          : false
        : false;

    const id = formData.get("id")?.toString();

    let parentKey = null;
    if (id !== "undefined") {
      const keyData = await db.folder.findFirst({
        select: {
          key: true,
        },
        where: { id: id },
      });
      if (keyData) parentKey = keyData.key;
    }

    if (formFile == null) {
      throw new Error("Invalid file");
    }

    const fileName =
      typeof formFileName === "string" ? formFileName : `${formFileName}`;

    // Get or create a folder if not exists
    const parentFolder = await getOrCreateParentFolder(userId, parentKey);

    const fileKey = `${parentFolder.key}${uuidv4()}`;

    // Create file record in the database
    const file = await db.file.create({
      data: {
        key: fileKey,
        name: fileName,
        userId: userId,
        isPublic: isPublic,
        folderId: parentFolder.id,
        type: fileExtension,
        containerId: session?.user?.profile?.containerId,
      },
    });

    // Upload File to S3
    const parallelUploads3 = new Upload({
      client: getS3Client(),
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: formFile,
      },
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    await parallelUploads3.done();

    return NextResponse.json({
      data: {
        file: file,
      },
    });
  } catch (error) {
    console.log("[UPLOAD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
