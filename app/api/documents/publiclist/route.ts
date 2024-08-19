import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

async function getFolderAndFiles(key: string | null, userId: string | null) {
  let folder;

  if (userId == null) {
    throw new Error("Login first to access");
  }

  if (key == null) {
    folder = await db.folder.findMany({
      where: { parentFolderId: null, isPublic: false },
      include: {
        subFolders: {
          where: { isPublic: true },
        },
        files: true,
      },
    });
  }
  if (key != null) {
    folder = await db.folder.findMany({
      where: { key: key, isPublic: true },
      include: {
        subFolders: {
          where: { isPublic: true },
        },
        files: true,
      },
    });
  }

  return folder;
}

export async function GET(req: any) {
  // POST /api/upload
  try {
    const { userId } = auth();

    const key = req.nextUrl.searchParams.get("key");

    if (userId == null) {
      throw new Error("Un Authorized");
    }

    //await getOrCreateParentFolder(userId);
    let parseKey = key;
    if (parseKey != null) {
      parseKey = key?.charAt(key.length - 1) !== `/` ? `${key}/` : key;
    }

    const data = await getFolderAndFiles(parseKey, userId);

    if (data == null) {
      return NextResponse.json(
        {
          message: `Requested ${key} not found`,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ data: data });
  } catch (error) {
    console.log("[SUBSCRIPTION] aa", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
