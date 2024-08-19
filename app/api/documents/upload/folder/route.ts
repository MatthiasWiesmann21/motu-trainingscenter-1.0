import createFolder from "@/app/vendor/aws/s3/createFolder";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const getOrCreateParentFolder = async (
  userId: string,
  parentKey?: string | null
) => {
  if (parentKey != null) {
    const parentFolder = await db.folder.findFirst({
      where: {
        key: parentKey,
        userId: userId,
        containerId: process.env.CONTAINER_ID,
      },
    });
    if (parentFolder == null) {
      throw new Error("Parent Folder Not Found");
    }
    return parentFolder;
  }

  // folderId is null now check if root fodler exists
  let rootFolder = await db.folder.findFirst({
    where: {
      parentFolder: null,
      userId: userId,
      containerId: process.env.CONTAINER_ID,
    },
  });
  if (rootFolder == null) {
    if (userId == null) {
      throw new Error("Login first to access");
    }
    // Create a root folder in S3 and add its path to db
    const key = `${userId}-root/`; // Adding slash at the end of key it will make a folder
    await createFolder(key);

    rootFolder = await db.folder.create({
      data: {
        name: key,
        key: key,
        isPublic: false,
        userId: userId,
        containerId: process.env.CONTAINER_ID,
      },
    });
  }

  return rootFolder;
};

export async function POST(req: Request) {
  // POST /api/upload
  try {
    const { userId } = auth();

    if (userId == null) {
      throw new Error("Un Authorized");
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

    // create or  get a folder if not exist

    const parentFolder = await getOrCreateParentFolder(userId, parentKey);

    const folderKey = `${parentFolder.key}${folderName}/`;

    // Check if folder already exist
    const tempFolder = await db.folder.findFirst({
      where: {
        key: folderKey,
      },
    });
    if (tempFolder != null) {
      return new NextResponse("Folder already created", { status: 200 });
    }
    // create folder

    const folder = await db.folder.create({
      data: {
        key: folderKey,
        name: folderName,
        userId: userId,
        isPublic: isPublic,
        parentFolderId: parentFolder.id,
        containerId: process.env.CONTAINER_ID,
      },
    });

    return NextResponse.json({ data: folder });
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
