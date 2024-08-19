import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { startDateTime, endDateTime, title, categoryId } = await req?.json();
    const liveEvent = await db?.liveEvent?.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
        containerId: process?.env?.CONTAINER_ID,
        startDateTime: { gte: startDateTime },
        endDateTime: { lte: endDateTime },
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(liveEvent);
  } catch (error) {
    console?.log("[EVENT FILTER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
