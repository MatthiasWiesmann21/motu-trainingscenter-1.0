import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the category exists
    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
        containerId: session?.user?.profile?.containerId,
      }
    });

    if (!category) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Delete the category
    const deletedCategory = await db.category.delete({
      where: {
        id: params.categoryId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { categoryId } = params;
    const values = await req.json();

    // Create an update object with only the fields that are provided
    const updateData: any = {};
    if (values.colorCode !== undefined) updateData.colorCode = values.colorCode;
    if (values.textColorCode !== undefined) updateData.textColorCode = values.textColorCode;
    if (values.darkTextColorCode !== undefined) updateData.darkTextColorCode = values.darkTextColorCode;
    if (values.name !== undefined) updateData.name = values.name;
    if (values.type !== undefined) updateData.type = values.type;

    // Update the category with only the provided fields
    const category = await db.category.update({
      where: {
        id: categoryId,
        containerId: session?.user?.profile?.containerId!,
      },
      data: updateData
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}