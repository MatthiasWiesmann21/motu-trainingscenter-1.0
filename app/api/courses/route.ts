import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const courseId = new URL(req.url).pathname.split("/")[2];
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        containerId: session?.user?.profile?.containerId,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            userProgress: {
              where: {
                userId,
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { title } = await req.json();

    const isRoleAdmins = await isAdmin();
    const isRoleClientAdmin = await isClientAdmin();
    const isRoleOperator = await isOperator();
    const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || await isOwner(userId);

    if (!userId || !canAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const container = await db.container.findUnique({
      where: {
        id: session?.user?.profile?.containerId
      },
    });

    const courses = await db.course.count({
      where: {
        containerId: session?.user?.profile?.containerId,
      },
    });

    if (
      container &&
      container.maxCourses !== null &&
      courses >= container.maxCourses
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
        containerId: session?.user?.profile?.containerId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
