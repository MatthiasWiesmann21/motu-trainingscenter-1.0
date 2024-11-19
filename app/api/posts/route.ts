import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function POST(req: Request) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { title } = await req.json();

    // Check user roles and ownership
    const isRoleAdmins = await isAdmin();
    const isRoleClientAdmin = await isClientAdmin();
    const isRoleOperator = await isOperator();
    const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || isOwner(userId);

    if (!userId || !canAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await db.post.create({
      data: {
        title,
        containerId: session?.user?.profile?.containerId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: any): Promise<void | Response> {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const page = req?.nextUrl?.searchParams?.get("page") || "1";
    const categoryId = req?.nextUrl?.searchParams?.get("categoryId") || "";
    const pageSize = 5;
    const skip = (parseInt(page) - 1) * pageSize;
    const currentDate = new Date(); // Get the current date and time

    if (!userId) throw new Error("Unauthorized");
    const profile = await db.profile.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!profile) return new NextResponse("Profile not found", { status: 404 });

    const posts =
    (await db.post.findMany({
      where: {
        isPublished: true,
        containerId: session?.user?.profile?.containerId,
        publishTime: {
          lte: currentDate,
        },
        ...(categoryId && { categoryId }),
        // Filter posts by matching usergroupId or allowing public (null) posts
        OR: [
          { usergroupId: profile.usergroupId },
          { usergroupId: null },
        ],
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
      take: pageSize,
      skip: skip,
      orderBy: {
        updatedAt: "desc",
      },
    })) || [];

  const postsWithData = posts.map((post) => {
    const commentsCount = post.comments.length;
    const likesCount = post.likes.length;
    const favoritesCount = post.favorites.length;

    const commentsWithLikes = post.comments
      .map((comment) => ({
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
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

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
      favoritesCount,
      currentLike,
      currentFavorite,
      commentsWithLikes,
    };
  });

  return NextResponse.json({ data: postsWithData });
} catch (error) {
  console.log("[GET_POSTS_ERROR]", error);
  return new NextResponse("Internal Error", { status: 500 });
}
}