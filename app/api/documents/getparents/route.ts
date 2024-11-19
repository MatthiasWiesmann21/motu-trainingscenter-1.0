import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const getFolderAndParents = async (id: string) => {
  const folderAndParents = [] as any;

  const recursivelyFetchParents = async (folderId: string) => {
    const result = await db.folder.findUnique({
      select: {
        id: true,
        name: true,
        isPublic: true,
        key: true,
        parentFolderId: true,
      },
      where: {
        id: folderId,
      },
    });

    if (result) {
      folderAndParents.push(result);
      if (result.parentFolderId !== null) {
        await recursivelyFetchParents(result.parentFolderId);
      }
    }
  };

  await recursivelyFetchParents(id);

  return folderAndParents;
};

export async function GET(req: any) {
  // POST /api/upload
  try {
    const id = req.nextUrl.searchParams.get("id");

    const parentFolders = await getFolderAndParents(id);

    return NextResponse.json({ data: parentFolders });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
