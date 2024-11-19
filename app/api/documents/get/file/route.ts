import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  // POST /api/upload
  try {
    const id = req.nextUrl.searchParams.get("id");
    let key = null;
    const keyData = await db.file.findFirst({
      select: {
        key: true,
        name: true,
        isPublic: true,
        folderId: true,
      },
      where: { id: id },
    });
    if (keyData) key = keyData.key;

    return NextResponse.json({ data: keyData });
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
