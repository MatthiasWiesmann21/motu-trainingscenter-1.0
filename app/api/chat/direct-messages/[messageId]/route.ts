import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const profile = await currentProfile();
    const { content, fileUrl } = await req.json();
    const { messageId } = params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messageId) {
      return new NextResponse("Message ID is required", { status: 400 });
    }

    // Find the existing message to ensure it belongs to the profile's conversation
    const existingMessage = await db.directMessage.findFirst({
      where: {
        id: messageId,
        member: {
          profileId: profile.id,
        },
      },
      include: {
        member: true,
      },
    });

    if (!existingMessage) {
      return new NextResponse("Message not found or not authorized", {
        status: 404,
      });
    }

    // Update the message content and/or fileUrl
    const updatedMessage = await db.directMessage.update({
      where: { id: messageId },
      data: {
        content: content || existingMessage.content,
        fileUrl: fileUrl || existingMessage.fileUrl,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
