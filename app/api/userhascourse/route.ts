import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth"; // Adjust the import based on your setup

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    console.log("What's in user" , userId , session  )
    if (!userId) {
      console.log("No user id found" , userId );
      // return new NextResponse("Unauthorized", { status: 401 });
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
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { courseId, status } = await req.json();

    if (!userId) {
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
    console.log("[COURSES POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
