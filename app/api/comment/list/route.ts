import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function POST(req: Request) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Extract data from the request
    const requestBody = await req.json();
    const { postId, liveEventId } = requestBody;

    const data = postId
      ? await db.comment.findMany({
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
        })
      : await db.comment.findMany({
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
          orderBy: {
            createdAt: "asc",
          },
        });

    return NextResponse.json({ data: data });
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
