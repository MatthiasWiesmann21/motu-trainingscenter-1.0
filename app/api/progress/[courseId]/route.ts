import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        containerId: process.env.CONTAINER_ID,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    console?.log("course", course);

    //   const userProgress = await db.userProgress.findUnique({
    //     where: {
    //       userId_chapterId: {
    //         userId,
    //         chapterId: params.chapterId,
    //       },
    //     },
    //   });

    //   if (!userProgress) {
    //     return new NextResponse("Not Found", { status: 404 });
    //   }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
