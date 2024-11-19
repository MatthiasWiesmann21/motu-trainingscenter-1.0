import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth"; 

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Check if userId is present
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the course with chapters
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        containerId: session?.user?.profile?.containerId,
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

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
