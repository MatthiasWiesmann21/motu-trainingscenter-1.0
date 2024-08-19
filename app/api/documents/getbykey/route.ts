import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  // POST /api/upload
  try {
    const { userId } = auth();

    const key = req.nextUrl.searchParams.get("key");
    let id = null;
    const idData = await db.folder.findFirst({
      select: {
        id: true,
      },
      where: { key: key },
    });
    if (idData) id = idData.id;

    return NextResponse.json({ data: id });
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
