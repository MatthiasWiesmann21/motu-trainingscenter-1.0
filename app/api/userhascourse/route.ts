import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userHasCourses = await db.userHasCourse.findMany({
      where: {
        userId, // Fetching courses for the authenticated user
      },
      include: {
        course: true, // Including related course data
      },
    });

    return NextResponse.json(userHasCourses);
  } catch (error) {
    console.log("[USERHASCOURSES GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authData = auth();
    const { userId, courseId, status } = await req.json();

    if (!authData?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userHasCourse = await db.userHasCourse.create({
      data: {
        userId,
        courseId,
        status,
      },
    });

    return NextResponse.json(userHasCourse);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
