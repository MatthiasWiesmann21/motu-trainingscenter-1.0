import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: any, res: any) {
  try {
    // Authenticate User here for downloading different files
    const requestBody = await req.json();
    const { id } = requestBody;

    let key = null;
    const keyData = await db.folder.findFirst({
      select: {
        key: true,
      },
      where: { id: id },
    });
    if (keyData) key = keyData.key;

    const result = await db.folder.delete({
      where: { id: id },
    });

    if (!result) {
      throw new Error("File not found");
    }

    // If needed, delete the file from the storage (e.g., AWS S3)

    return new NextResponse("File deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[DELETE FILE ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
