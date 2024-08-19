import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (userId == null) {
      throw new Error("Un Authorized");
    }
    const requestBody = await req.json();

    const { text, postId, parentCommentId, liveEventId, chapterId } =
      requestBody;

    const profile = await db.profile.findFirst({
      select: {
        id: true,
      },
      where: { userId: userId },
    });
    if (profile == null) {
      throw new Error("Profile not found");
    }
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
    const postDetails = await db?.post?.findFirst({
      where: {
        isPublished: true,
        containerId: process.env.CONTAINER_ID,
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
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
