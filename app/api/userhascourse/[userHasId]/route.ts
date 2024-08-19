import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userHasId: string } }
) {
  const { userId }: any = auth();
  const { userHasId } = params;
  try {
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
    const { userHasId } = params;
    const { userId, courseId, status } = await req.json();

    const authData = auth();
    if (!authData?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
