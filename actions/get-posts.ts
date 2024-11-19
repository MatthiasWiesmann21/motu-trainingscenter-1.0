import { Category, Post } from "@prisma/client";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth"; // Import your NextAuth configuration

type PostWithProgressWithCategory = Post & {
  category: Category | null;
  comments: any[];
};

type GetPosts = {
  title?: string;
  categoryId?: string;
};

export const getPosts = async ({
  title,
  categoryId,
}: GetPosts): Promise<PostWithProgressWithCategory[]> => {
  try {
    // Fetch the session using NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

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
        favorites: true,
      },
    });

    const postsWithData = posts.map((post) => {
      const commentsCount = post.comments.length;
      const likesCount = post.likes.length;

      const commentsWithLikes = post.comments.map((comment) => ({
        ...comment,
        commentLikesCount: comment.likes.length,
        currentCommentLike: comment.likes.some(
          (like) => like.profileId === profile.id
        ),
        subCommentsWithLikes: comment.subComment.map((subcomment) => ({
          ...subcomment,
          commentLikesCount: subcomment.likes.length,
          currentCommentLike: subcomment.likes.some(
            (like) => like.profileId === profile.id
          ),
        })),
      }));

      const currentLike = post.likes.some(
        (like) => like.profileId === profile.id
      );
      const currentFavorite = post.favorites.some(
        (favorite) => favorite.profileId === profile.id
      );

      return {
        ...post,
        commentsCount,
        likesCount,
        currentLike,
        currentFavorite,
        commentsWithLikes,
      };
    });

    return postsWithData;
  } catch (error) {
    console.log("[GET_POSTS]", error);
    return [];
  }
};
