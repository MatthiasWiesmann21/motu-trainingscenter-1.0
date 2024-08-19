import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const { userId } = auth();

    if (userId == null) {
      throw new Error("Un Authorized");
    }
    const requestBody = await req.json();

    const { postId, liveEventId } = requestBody;

    // const postId = req.nextUrl.searchParams.get("postId");

    const comment = await db.comment.findMany({
      select: {
        text: true,
        id: true,
        createdAt: true,
        subComment: {
          select: {
            id: true,
            text: true,
          },
        },
        profile: {
          select: {
            id: true,
            imageUrl: true,
            name: true,
            email: true,
          },
        },
        likes: {
          select: {
            id: true,
          },
        },
      },
      where: { postId: postId },
      // orderBy: { createdAt: "desc" },
    });

    const chat = await db?.comment?.findMany({
      select: {
        text: true,
        id: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            imageUrl: true,
            name: true,
            email: true,
          },
        },
      },
      where: { liveEventId },
      // orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: postId ? comment : chat });
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
