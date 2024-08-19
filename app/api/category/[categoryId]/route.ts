import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
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

    const deletedCategory = await db.category.delete({
      where: {
        id: params.categoryId,
        containerId: process.env.CONTAINER_ID,
      },
    });

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { categoryId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const category = await db.category.update({
      where: {
        id: categoryId,
        containerId: process.env.CONTAINER_ID,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}