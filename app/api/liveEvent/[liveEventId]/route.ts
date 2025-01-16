import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await db.liveEvent.findUnique({
      where: {
        id: params.eventId,
        containerId: session?.user?.profile?.containerId,
      },
      include: {
        category: {
          select: {
            name: true,
            colorCode: true,
            textColorCode: true,
          },
        },
      },
    });

    if (!event) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.log("[LIVE_EVENT_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}