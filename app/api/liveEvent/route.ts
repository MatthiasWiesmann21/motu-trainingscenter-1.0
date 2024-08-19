import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    const isRoleAdmins = await isAdmin();
    const isRoleOperator = await isOperator();
    const canAccess = isRoleAdmins || isRoleOperator || isOwner(userId);

    if (!userId || !canAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveEvent = await db.liveEvent.create({
      data: {
        userId,
        title,
        containerId: process.env.CONTAINER_ID || "",
      },
    });

    return NextResponse.json(liveEvent);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // const { title, categoryId } = await req?.json();
    const liveEvent = await db?.liveEvent?.findMany({
      where: {
        isPublished: true,
        // title: {
        //   contains: title,
        // },
        // categoryId,
        containerId: process?.env?.CONTAINER_ID,
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
    console?.log("[EVENT GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
