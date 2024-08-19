import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
        containerId: process.env.CONTAINER_ID,
      }
    });

    if (!category) {
      return new NextResponse("Not found", { status: 404 });
    }

    const publishedCategory = await db.category.update({
      where: {
        id: params.categoryId,
        containerId: process.env.CONTAINER_ID,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedCategory);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}