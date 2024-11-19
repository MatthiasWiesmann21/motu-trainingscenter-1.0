import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth"; // Ensure this is the path to your NextAuth configuration

export async function POST(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const requestBody = await req.json();
    const { postId, commentId, liveEventId, chapterId } = requestBody;

    // Find the profile associated with the user ID
    const profile = await db.profile.findFirst({
      select: {
        id: true,
      },
      where: { userId: userId },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    let likeData;
    if (postId) {
      likeData = {
        profile: { connect: { id: profile.id } },
        post: { connect: { id: postId } },
      };
    } else if (commentId) {
      likeData = {
        profile: { connect: { id: profile.id } },
        comment: { connect: { id: commentId } },
      };
    } else if (liveEventId) {
      likeData = {
        profile: { connect: { id: profile.id } },
        liveEvent: { connect: { id: liveEventId } },
      };
    } else if (chapterId) {
      likeData = {
        profile: { connect: { id: profile.id } },
        chapter: { connect: { id: chapterId } },
      };
    } else {
      return new NextResponse(
        "Invalid like data. Please provide either postId, commentId, liveEventId or chapterId.",
        { status: 400 }
      );
    }

    // Check if a like with the same profile ID and post/comment ID exists
    const existingLike = await db.like.findFirst({
      where: {
        profileId: profile.id,
        postId: postId || undefined,
        commentId: commentId || undefined,
        liveEventId: liveEventId || undefined,
        chapterId: chapterId || undefined,
      },
    });

    if (existingLike) {
      // If an existing like is found, delete it
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ data: "Dislike" });
    } else {
      // Otherwise, create a new like
      await db.like.create({
        data: likeData,
      });
      return NextResponse.json({ data: "Like" });
    }
  } catch (error) {
    console.log("[LIKE_HANDLER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
