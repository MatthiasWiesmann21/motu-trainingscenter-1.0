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

    const { postId, commentId, liveEventId, chapterId } = requestBody;

    // Find the profile associated with the user ID
    const profile = await db.profile.findFirst({
      select: {
        id: true,
      },
      where: { userId: userId },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    let likeData;
    if (postId) {
      // If postId exists, it means the like is on a post
      likeData = {
        profile: { connect: { id: profile.id } },
        post: { connect: { id: postId } },
      };
    } else if (commentId) {
      // If commentId exists, it means the like is on a comment
      likeData = {
        profile: { connect: { id: profile.id } },
        comment: { connect: { id: commentId } },
      };
    } else if (liveEventId) {
      // If commentId exists, it means the like is on a comment
      likeData = {
        profile: { connect: { id: profile.id } },
        liveEvent: { connect: { id: liveEventId } },
      };
    } else if (chapterId) {
      // If commentId exists, it means the like is on a comment
      likeData = {
        profile: { connect: { id: profile.id } },
        chapter: { connect: { id: chapterId } },
      };
    } else {
      // Handle the case where neither postId nor commentId is provided
      throw new Error(
        "Invalid like data. Please provide either postId, commentId, liveEventId or chapterId."
      );
    }

    // Check if a like with the same profile ID and post/comment ID exists
    const existingLike = await db.like.findFirst({
      where: {
        profileId: profile.id,
        postId: postId,
        commentId: commentId,
        liveEventId,
        chapterId,
      },
    });

    if (existingLike)
      // If an existing like is found, delete it
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    //   return NextResponse.json({ data: "Dislike", post });
    // Otherwise, create a new like
    else
      await db.like.create({
        data: likeData,
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

    return NextResponse.json({ data: existingLike ? "Dislike" : "Like", post });
  } catch (error) {
    console.log("[SUBSCRIPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
