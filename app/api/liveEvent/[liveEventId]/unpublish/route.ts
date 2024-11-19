
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function PATCH(
  req: Request,
  { params }: { params: { liveEventId: string } }
) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveEvent = await db.liveEvent.findUnique({
      where: {
        id: params.liveEventId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    if (!liveEvent) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedEvent = await db.liveEvent.update({
      where: {
        id: params.liveEventId,
        containerId: session?.user?.profile?.containerId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedEvent);
  } catch (error) {
    console.log("[LIVE_EVENT_UNPUBLISH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
