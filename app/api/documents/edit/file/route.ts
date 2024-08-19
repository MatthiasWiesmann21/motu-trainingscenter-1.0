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

    const { id, fileName, isPublic } = requestBody;

    const existingFile = await db.file.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingFile) {
      throw new Error("File not found or you don't have permission to edit.");
    }

    // Update the file
    const updatedFile = await db.file.update({
      where: { id: existingFile.id },
      data: {
        name: fileName,
        isPublic: isPublic,
      },
    });

    return NextResponse.json({ data: updatedFile });
  } catch (error) {
    console.log("[EDIT FILE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
