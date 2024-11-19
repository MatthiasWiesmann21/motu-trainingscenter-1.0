import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { content, fileUrl } = await req.json();
    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId && !conversationId) {
      return new NextResponse(
        "Either Channel ID or Conversation ID is required",
        { status: 400 }
      );
    }

    if (!content) {
      return new NextResponse("Content missing", { status: 400 });
    }

    let message;
    let channelKey;

    if (channelId) {
      // Handle channel message
      const channel = await db.channel.findFirst({
        where: {
          id: channelId,
        },
        include: {
          server: {
            include: {
              members: true,
            },
          },
        },
      });

      if (!channel) {
        return new NextResponse("Channel not found", { status: 404 });
      }

      const member = channel.server.members.find(
        (member) => member.profileId === profile.id
      );

      if (!member) {
        return new NextResponse("Member not found", { status: 404 });
      }

      message = await db.message.create({
        data: {
          content,
          fileUrl,
          channelId,
          memberId: member.id,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      channelKey = `chat:${channelId}:messages`;
    } else if (conversationId) {
      // Handle conversation message
      const conversation = await db.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            { memberOne: { profileId: profile.id } },
            { memberTwo: { profileId: profile.id } },
          ],
        },
        include: {
          memberOne: { include: { profile: true } },
          memberTwo: { include: { profile: true } },
        },
      });

      if (!conversation) {
        return new NextResponse("Conversation not found", { status: 404 });
      }

      const member =
        conversation.memberOne.profileId === profile.id
          ? conversation.memberOne
          : conversation.memberTwo;

      if (!member) {
        return new NextResponse("Member not found", { status: 404 });
      }

      message = await db.directMessage.create({
        data: {
          content,
          fileUrl,
          conversationId,
          memberId: member.id,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      channelKey = `chat:${conversationId}:messages`;
    }

    // @ts-ignore
    // Emitting message through the socket
    req?.socket?.server?.io?.emit(channelKey, message);

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
