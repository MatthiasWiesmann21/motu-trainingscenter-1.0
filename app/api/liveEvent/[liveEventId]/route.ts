import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { userId } = auth();
  const { searchParams } = new URL(req.url);
  const liveEventId = searchParams?.get("liveEventId") || "";
  try {
    if (userId === null) throw new Error("Un Authorized");
    const profile = await db?.profile?.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: userId,
      },
    });

    const liveEvent = await db.liveEvent.findUnique({
      where: {
        id: liveEventId,
        isPublished: true,
      },
      include: {
        likes: true,
      },
    });

    const currentLike = liveEvent?.likes?.some(
      (like) => like?.profileId === profile?.id
    );

    const category = await db.category.findUnique({
      where: {
        id: liveEvent?.categoryId ?? undefined,
        isPublished: true,
        isLiveEventCategory: true,
      },
    });

    return NextResponse.json({
      liveEvent: { ...liveEvent, currentLike },
      category,
    });
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { liveEventId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveEvent = await db.liveEvent.findUnique({
      where: {
        id: params.liveEventId,
        containerId: process.env.CONTAINER_ID,
      },
    });

    if (!liveEvent) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedEvent = await db.liveEvent.delete({
      where: {
        id: params.liveEventId,
        containerId: process.env.CONTAINER_ID,
      },
    });

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.log("[EVENT_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { liveEventId: string } }
) {
  try {
    const { userId } = auth();
    const { liveEventId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveEvent = await db.liveEvent.update({
      where: {
        id: liveEventId,
        containerId: process.env.CONTAINER_ID,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(liveEvent);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
