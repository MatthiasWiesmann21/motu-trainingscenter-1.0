import createFolder from "@/app/vendor/aws/s3/createFolder";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/roleCheckServer";
const getOrCreateParentFolder = async (userId: string, parentKey?: string) => {

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

  let rootFolder = await db.folder.findFirst({
    where: {
      parentFolder: null,
      userId: userId,
      containerId: session?.user?.profile?.containerId,
    },
  });
  if (rootFolder == null) {
    const key = `${userId}-root/`; // Adding slash at the end of key it will make a folder
    await createFolder(key);

    rootFolder = await db.folder.create({
      data: {
        name: key,
        key: key,
        isPublic: true,
        userId: userId,
        containerId: session?.user?.profile?.containerId,
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

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  if (userId == null) {
    throw new Error("Login first to access");
  }

  const canAccess = await isAdmin();

  if (canAccess) {
    if (key == null) {
      folder = await db.folder.findFirst({
        where: {
          parentFolderId: null,
          userId: userId,
          containerId: session?.user?.profile?.containerId,
        },
        include: {
          subFolders: {
            where: {
              OR: [{ isPublic: true }, { userId: userId }],
              containerId: session?.user?.profile?.containerId,
            },
          },
          files: {
            where: {
              containerId: session?.user?.profile?.containerId,
              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
        },
      });
    } else {
      folder = await db.folder.findFirst({
        where: { key: key, containerId: session?.user?.profile?.containerId },
        include: {
          subFolders: {
            where: {
              containerId: session?.user?.profile?.containerId,
              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
          files: {
            where: {
              containerId: session?.user?.profile?.containerId,
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
          containerId: session?.user?.profile?.containerId,
        },
        include: {
          subFolders: {
            where: {
              containerId: session?.user?.profile?.containerId,
              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
          files: {
            where: {
              containerId: session?.user?.profile?.containerId,
              OR: [{ isPublic: true }, { userId: userId }],
            },
          },
        },
      });
    } else if (!isPublicDirectory) {
      folder = await db.folder.findFirst({
        where: { key: key, containerId: session?.user?.profile?.containerId },
        include: {
          subFolders: {
            where: {
              containerId: session?.user?.profile?.containerId,
            },
          },
          files: {
            where: { isPublic: true, containerId: session?.user?.profile?.containerId },
          },
        },
      });
    } else {
      folder = await db.folder.findFirst({
        where: { key: key, containerId: session?.user?.profile?.containerId },
        include: {
          subFolders: {
            where: { isPublic: true, containerId: session?.user?.profile?.containerId },
          },
          files: {
            where: { isPublic: true, containerId: session?.user?.profile?.containerId},
          },
        },
      });
    }
  }

  return folder;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const id = (req as any).nextUrl.searchParams.get("key");
    const isPublicDirectory = (req as any).nextUrl.searchParams.get("isPublicDirectory");
    const canAccess = await isAdmin();

    let key = null;
    if (id) {
      const keyData = await db.folder.findFirst({
        select: {
          key: true,
        },
        where: { id: id, containerId: session?.user?.profile?.containerId },
      });
      key = keyData?.key;
    }

    if (userId == null) {
      throw new Error("Unauthorized");
    }

    if (canAccess) {
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
