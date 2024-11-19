import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth"; // Ensure this points to your NextAuth configuration

export async function PATCH(
  req: Request,
  { params }: { params: { liveEventId: string } }
) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession({ req, ...authOptions });
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the live event exists
    const liveEvent = await db.liveEvent.findUnique({
      where: {
        id: params.liveEventId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    if (!liveEvent) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the live event to be published
    const publishedEvent = await db.liveEvent.update({
      where: {
        id: params.liveEventId,
        containerId: session?.user?.profile?.containerId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedEvent);
  } catch (error) {
    console.log("[LIVE_EVENT_PUBLISH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
