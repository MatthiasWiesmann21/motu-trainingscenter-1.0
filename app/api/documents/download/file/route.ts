import getS3SignedUrl from "@/app/vendor/aws/s3/getS3SignedUrl";
import { db } from "@/lib/db";
import { Duration } from "luxon";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    const key = req.nextUrl.searchParams.get("key"); // file to download

    const extensionData: any = await db.file.findFirst({
      select: {
        type: true,
        name: true,
      },

      where: { key: key },
    });
    const fileExtension = extensionData.type; // Removing the dot from the extension

    if (fileExtension == null) {
      return;
    }

    const fileName = extensionData.name; // Removing the dot from the extension

    const downloadUrl = await getS3SignedUrl({
      fileKey: key,
      fileExtension: fileExtension,
      fileName: fileName,
      duration: Duration.fromObject({
        minutes: 30,
      }),
    });

    return NextResponse.json({
      data: {
        downloadUrl: downloadUrl,
        fileExtension: fileExtension, // Including file extension in the response
      },
    });
  } catch (error) {
    console.log("[SUBSCRIPTION]  ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
