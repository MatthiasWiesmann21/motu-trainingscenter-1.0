import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId || !isOwner(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await db.post.create({
      data: {
        title,
        containerId: process.env.CONTAINER_ID || '',
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}