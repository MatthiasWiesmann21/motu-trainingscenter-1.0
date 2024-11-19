import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(req: any) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

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
export const dynamic = 'force-dynamic';
