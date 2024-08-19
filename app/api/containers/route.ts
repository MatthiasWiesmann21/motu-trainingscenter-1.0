import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const { name, imageUrl, link, clientPackage, maxCourses } = await req.json();


    if (!userId || !isOwner(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const container = await db.container.create({
      data: {
        name,
        imageUrl,
        link,
        clientPackage,
        maxCourses,
      }
    });

    return NextResponse.json(container);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}