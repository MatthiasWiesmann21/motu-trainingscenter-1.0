import { db } from "@/lib/db";

import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function POST(req: Request) {
  try {
      const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
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
