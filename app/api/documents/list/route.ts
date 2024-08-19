import createFolder from "@/app/vendor/aws/s3/createFolder";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { isOwner } from "@/lib/owner";

const getOrCreateParentFolder = async (userId: string, parentKey?: string) => {
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
    const { userId } = auth();
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
        isPublic: true,
        userId: userId,
        containerId: process.env.CONTAINER_ID,
      },
    });
  }

  return rootFolder;
};

async function getFolderAndFiles(
  key: string | null,
  userId: string | null,
  isPublicDirectory?: boolean
) {
  let folder;

  if (userId == null) {
    throw new Error("Login first to access");
  }

  if (isOwner(userId)) {
    if (key == null) {
      folder = await db.folder.findFirst({
        where: {
          parentFolderId: null,
          userId: userId,
          containerId: process.env.CONTAINER_ID,
        },
        include: {
          subFolders: {
            where: {
              OR: [{ isPublic: true }, { userId: userId }],
              containerId: process.env.CONTAINER_ID,
            },
          },
          files: {
            where: {
              containerId: process.env.CONTAINER_ID,
              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
        },
      });
    }
    if (key != null) {
      folder = await db.folder.findFirst({
        where: { key: key, containerId: process.env.CONTAINER_ID },
        include: {
          subFolders: {
            where: {
              containerId: process.env.CONTAINER_ID,

              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
          files: {
            where: {
              containerId: process.env.CONTAINER_ID,

              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
        },
      });
    }
  } else {
    if (key == null) {
      folder = await db.folder.findFirst({
        where: {
          parentFolderId: null,
          containerId: process.env.CONTAINER_ID,
        },
        include: {
          subFolders: {
            where: {
              containerId: process.env.CONTAINER_ID,
              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
          files: {
            where: {
              containerId: process.env.CONTAINER_ID,
              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
        },
      });
    }
    if (key != null && !isPublicDirectory) {
      folder = await db.folder.findFirst({
        where: { key: key, containerId: process.env.CONTAINER_ID },
        include: {
          subFolders: {
            where: {
              containerId: process.env.CONTAINER_ID,
            },
          },
          files: {
            where: { isPublic: true, containerId: process.env.CONTAINER_ID },
          },
        },
      });
    }

    if (key != null && isPublicDirectory) {
      folder = await db.folder.findFirst({
        where: { key: key, containerId: process.env.CONTAINER_ID },
        include: {
          subFolders: {
            where: { isPublic: true, containerId: process.env.CONTAINER_ID },
          },
          files: {
            where: { isPublic: true, containerId: process.env.CONTAINER_ID },
          },
        },
      });
    }
  }

  return folder;
}

export async function GET(req: any) {
  // POST /api/upload
  try {
    const { userId } = auth();

    const id = req.nextUrl.searchParams.get("key");
    const isPublicDirectory = req.nextUrl.searchParams.get("isPublicDirectory");

    let key = null;
    if (id) {
      const keyData = await db.folder.findFirst({
        select: {
          key: true,
        },
        where: { id: id, containerId: process.env.CONTAINER_ID },
      });
      key = keyData?.key;
    }

    if (userId == null) {
      throw new Error("Un Authorized");
    }

    if (isOwner(userId)) {
      await getOrCreateParentFolder(userId);
    }

    let parseKey = key || null;
    if (parseKey != null) {
      parseKey = key?.charAt(key.length - 1) !== `/` ? `${key}/` : key;
    }

    const data = await getFolderAndFiles(parseKey, userId, isPublicDirectory);

    if (data == null) {
      return NextResponse.json(
        {
          message: `Requested resource not found`,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ data: data });
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
