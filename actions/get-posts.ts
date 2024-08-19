import { Category, Post } from "@prisma/client";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs";

type PostWithProgressWithCategory = Post & {
  category: Category | null;
  comments: any[];
};

type GetPosts = {
  // userId?: string;
  title?: string;
  categoryId?: string;
};

export const getPosts = async ({
  // userId,
  title,
  categoryId,
}: GetPosts): Promise<PostWithProgressWithCategory[]> => {
  try {
    const { userId } = auth();

    if (userId == null) {
      throw new Error("Un Authorized");
    }

    const profile = await db.profile.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: userId,
      },
    });

    if (profile === null) {
      return [];
    }

    const posts = await db.post.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
        containerId: process.env.CONTAINER_ID,
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

    const postsWithData = posts.map((post, i) => {
      const commentsCount = post.comments.length;
      const likesCount = post.likes.length;

      const commentsWithLikes = post.comments.map((comment) => ({
        ...comment,
        commentLikesCount: comment.likes.length,
        currentCommentLike: comment.likes.some((like) => like.profileId === profile.id),
        subCommentsWithLikes: comment.subComment.map((subcomment) => ({
          ...subcomment,
          commentLikesCount: subcomment.likes.length,
          currentCommentLike: subcomment.likes.some((like) => like.profileId === profile.id),
        }))
      }));

      // Check if the current profile has liked the post
      const currentLike = post.likes.some((like) => like.profileId === profile.id);

      // Return the post data along with the calculated counts and like state
      return {
        ...post,
        commentsCount,
        likesCount,
        currentLike,
        commentsWithLikes,
      };
    });

    return postsWithData;
  } catch (error) {
    console.log("[GET_POSTS]", error);
    return [];
  }
};
