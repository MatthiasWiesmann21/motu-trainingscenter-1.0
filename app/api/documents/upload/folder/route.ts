import createFolder from "@/app/vendor/aws/s3/createFolder";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth"; // Ensure this is the path to your NextAuth configuration
import { redirect } from "next/navigation";

const getOrCreateParentFolder = async (
  userId: string,
  parentKey?: string | null
) => {

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

  // FolderId is null now check if root folder exists
  let rootFolder = await db.folder.findFirst({
    where: {
      parentFolder: null,
      userId: userId,
      containerId: session?.user?.profile?.containerId,
    },
  });
  if (rootFolder == null) {
    if (userId == null) {
      throw new Error("Login first to access");
    }
    // Create a root folder in S3 and add its path to db
    const key = `${userId}-root/`; // Adding slash at the end of key to make it a folder
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

export async function POST(req: Request) {
  // POST /api/upload
  try {
    const session = await getServerSession({ req, ...authOptions });
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const requestBody = await req.json();

    // FolderId null means it will upload in root folder
    const { id, folderName, isPublic } = requestBody;
    let parentKey = null;
    if (id) {
      const keyData = await db.folder.findFirst({
        select: {
          key: true,
        },
        where: { id: id },
      });
      if (keyData) parentKey = keyData.key;
    }

    // Create or get a folder if not exist
    const parentFolder = await getOrCreateParentFolder(userId, parentKey);

    const folderKey = `${parentFolder.key}${folderName}/`;

    // Check if folder already exists
    const tempFolder = await db.folder.findFirst({
      where: {
        key: folderKey,
      },
    });
    if (tempFolder != null) {
      return new NextResponse("Folder already created", { status: 200 });
    }

    // Create folder
    const folder = await db.folder.create({
      data: {
        key: folderKey,
        name: folderName,
        userId: userId,
        isPublic: isPublic,
        parentFolderId: parentFolder.id,
        containerId: session?.user?.profile?.containerId,
      },
    });

    return NextResponse.json({ data: folder });
  } catch (error) {
    console.log("[FOLDER_CREATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
