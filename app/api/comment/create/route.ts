import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function POST(req: Request) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const requestBody = await req.json();
    const { text, postId, parentCommentId, liveEventId, chapterId } =
      requestBody;

    // Find the profile associated with the user
    const profile = await db.profile.findFirst({
      select: {
        id: true,
      },
      where: { userId: userId },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    // Create the comment
    const comment = await db.comment.create({
      data: {
        text: text,
        postId: postId,
        profileId: profile.id,
        parentCommentId: parentCommentId,
        liveEventId,
        chapterId,
      },
    });
    if (postId) {
      // Fetch post details with comments and likes
      const postDetails = await db.post.findFirst({
        where: {
          isPublished: true,
          containerId: session?.user?.profile?.containerId,
          id: postId,
        },
        include: {
          category: true,
          comments: {
            include: {
              likes: true,
              subComment: {
                include: {
                  likes: true,
                  profile: true,
                },
              },
              profile: true,
            },
            where: {
              parentComment: null,
            },
          },
          likes: true,
        },
      });

      const post = {
        ...postDetails,
        commentsCount: postDetails?.comments?.length,
        likesCount: postDetails?.likes?.length,
        currentLike: postDetails?.likes?.some(
          (like) => like?.profileId === profile?.id
        ),
        commentsWithLikes: postDetails?.comments
          ?.map((comment) => ({
            ...comment,
            commentLikesCount: comment?.likes?.length,
            currentCommentLike: comment?.likes?.some(
              (like) => like.profileId === profile.id
            ),
            subCommentsWithLikes: comment?.subComment?.map((subcomment) => ({
              ...subcomment,
              commentLikesCount: subcomment?.likes?.length,
              currentCommentLike: subcomment?.likes?.some(
                (like) => like?.profileId === profile?.id
              ),
            })),
          }))
          //@ts-ignore
          ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)),
      };

      return NextResponse.json({ data: comment, post });
    }
    return NextResponse.json({ data: comment });
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
