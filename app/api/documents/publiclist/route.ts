import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
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
  } else {
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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const key = new URL(req.url).searchParams.get("key");

    if (userId == null) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let parseKey = key;
    if (parseKey != null) {
      parseKey = (key || '').charAt((key || '').length - 1) !== `/` ? `${key}/` : key;
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
    console.log("[FOLDER_FETCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
