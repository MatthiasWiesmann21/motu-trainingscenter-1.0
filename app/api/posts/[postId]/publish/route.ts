import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: {
        userId,
        containerId: process.env.CONTAINER_ID,
      }
    })

    const post = await db.post.findUnique({
      where: {
        id: params.postId,
        containerId: process.env.CONTAINER_ID,
      }
    });

    if (!post) {
      return new NextResponse("Not found", { status: 404 });
    }

    const publishedPost = await db.post.update({
      where: {
        id: params.postId,
        containerId: process.env.CONTAINER_ID,
      },
      data: {
        isPublished: true,
        publishTime: new Date(),
        publisherName: profile?.name,
        publisherImageUrl: profile?.imageUrl,
      }
    });

    if (post.scheduleDateTime && post.scheduleDateTime > new Date()) {
      await db.post.update({
        where: {
          id: params.postId,
          containerId: process.env.CONTAINER_ID,
        },
        data: {
          publishTime: post.scheduleDateTime,
        }
      })
    }

    return NextResponse.json(publishedPost);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}