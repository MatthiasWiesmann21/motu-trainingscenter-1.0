import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth"; // Ensure this is the path to your NextAuth configuration

export async function GET(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    const userId = session?.user?.id;
    const { searchParams } = new URL(req.url);
    const liveEventId = searchParams.get("liveEventId") || "";

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.profile.findFirst({
      select: {
        id: true,
        usergroupId: true,
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
        favorites: true,
      },
    });

    // Check usergroup access before proceeding
    if (liveEvent?.usergroupId && profile?.usergroupId !== liveEvent.usergroupId) {
      return new NextResponse("Unauthorized - Invalid usergroup", { status: 403 });
    }

    const currentLike = liveEvent?.likes?.some(
      (like) => like.profileId === profile?.id
    );

    const currentFavorite = liveEvent?.favorites?.some(
      (favorite) => favorite.profileId === profile?.id
    );

    const category = await db.category.findUnique({
      where: {
        id: liveEvent?.categoryId ?? undefined,
        isPublished: true,
        isLiveEventCategory: true,
      },
    });

    return NextResponse.json({
      liveEvent: { ...liveEvent, currentLike, currentFavorite },
      category,
    });
  } catch (error) {
    console.log("[LIVE_EVENT_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { liveEventId: string } }
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
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

    const deletedEvent = await db.liveEvent.delete({
      where: {
        id: params.liveEventId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.log("[LIVE_EVENT_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { liveEventId: string } }
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    const userId = session?.user?.id;
    const { liveEventId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveEvent = await db.liveEvent.update({
      where: {
        id: liveEventId,
        containerId: session?.user?.profile?.containerId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(liveEvent);
  } catch (error) {
    console.log("[LIVE_EVENT_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}