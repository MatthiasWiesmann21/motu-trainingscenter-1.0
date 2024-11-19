import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { courseId, chapterId } = params;
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
        containerId: session?.user?.profile?.containerId,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      include: {
        likes: true,
        favorites: true,
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
      },
    });

    if (!chapter || !course)
      return new NextResponse("Chapter or Course not found..!!", {
        status: 404,
      });

    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase)
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });

    if (chapter.isFree || purchase)
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    const profile = await db?.profile?.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: userId,
      },
    });

    const currentLike = chapter?.likes?.some(
      (like) => like?.profileId === profile?.id
    );
    const currentFavorite = chapter?.favorites?.some(
      (favorite) => favorite?.profileId === profile?.id
    );

    const commentsWithLikes = chapter?.comments
      ?.map((comment) => ({
        ...comment,
        commentLikesCount: comment?.likes?.length,
        currentCommentLike: comment?.likes?.some(
          (like) => like.profileId === profile?.id
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
      ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));

    return NextResponse.json({
      chapter: { ...chapter, currentLike, currentFavorite, commentsWithLikes },
      course,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    });
  } catch (error) {
    console.log("[CHAPTER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
          containerId: session?.user?.profile?.containerId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
