import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth"; // Adjust import based on where your authOptions are defined

export async function GET(
  req: Request,
  { params }: { params: { userHasId: string } }
) {
  const session = await getServerSession(authOptions);
  const { userId } = session?.user || {};
  const { userHasId } = params;
  
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userHasCourse = await db.userHasCourse.findFirst({
      where: { courseId: userHasId, userId },
      include: {
        course: true, // Including related course data
      },
    });

    if (!userHasCourse) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(userHasCourse);
  } catch (error) {
    console.log("[USERHASCOURSE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userHasId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { userId } = session?.user || {};
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userHasId } = params;
    const { courseId, status } = await req.json();

    const userHasCourse = await db.userHasCourse.update({
      where: { id: userHasId },
      data: {
        userId,
        courseId,
        status,
      },
    });

    return NextResponse.json(userHasCourse);
  } catch (error) {
    console.log("[USERHASCOURSE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
