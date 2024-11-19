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
    const { postId, liveEventId, chapterId, courseId } = requestBody;

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

    let favoriteData;
    if (postId) {
      favoriteData = {
        profile: { connect: { id: profile.id } },
        post: { connect: { id: postId } },
      };
    } else if (liveEventId) {
      favoriteData = {
        profile: { connect: { id: profile.id } },
        liveEvent: { connect: { id: liveEventId } },
      };
    } else if (courseId) {
      favoriteData = {
        profile: { connect: { id: profile.id } },
        // @ts-ignore
        course: { connect: { id: courseId } },
      };
    } else if (chapterId) {
      favoriteData = {
        profile: { connect: { id: profile.id } },
        chapter: { connect: { id: chapterId } },
      };
    } else {
      return new NextResponse(
        "Invalid favorite data. Please provide either postId, commentId, liveEventId or chapterId.",
        { status: 400 }
      );
    }

    // Check if a favorite with the same profile ID and post/comment ID exists
    const existingFavorite = await db.favorite.findFirst({
      where: {
        profileId: profile.id,
        postId: postId || undefined,
        liveEventId: liveEventId || undefined,
        // @ts-ignore
        courseId: courseId || undefined,
        chapterId: chapterId || undefined,
      },
    });

    if (existingFavorite) {
      // If an existing favorite is found, delete it
      await db.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return NextResponse.json({ data: "NotFavorite" });
    } else {
      // Otherwise, create a new favorite
      await db.favorite.create({
        data: favoriteData,
      });
      return NextResponse.json({ data: "Favorite" });
    }
  } catch (error) {
    console.log("[FAVORITE_HANDLER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
