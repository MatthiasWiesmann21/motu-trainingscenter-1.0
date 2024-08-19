import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (userId == null) {
      throw new Error("Un Authorized");
    }

    const requestBody = await req.json();

    const { id, folderName, isPublic } = requestBody;

    // Check if the user has permission to edit this folder
    const existingFolder = await db.folder.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingFolder) {
      throw new Error("Folder not found or you don't have permission to edit.");
    }

    // Update the folder
    const updatedFolder = await db.folder.update({
      where: { id: existingFolder.id },
      data: {
        name: folderName,
        isPublic: isPublic,
      },
    });

    return NextResponse.json({ data: updatedFolder });
  } catch (error) {
    console.log("[EDIT FOLDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
