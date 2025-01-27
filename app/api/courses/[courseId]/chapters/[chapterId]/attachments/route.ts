import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function POST(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { url, name } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
        containerId: session?.user?.profile?.containerId,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.create({
      // @ts-ignore
      data: {
        url,
        name: name,
        chapterId: params.chapterId,
      }
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[COURSE_ID_ATTACHMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};