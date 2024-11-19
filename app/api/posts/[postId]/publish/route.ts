import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth"; // Your NextAuth configuration

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions); // Get session data

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const profile = await db.profile.findFirst({
      where: {
        userId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: params.postId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    if (!post) {
      return new NextResponse("Not found", { status: 404 });
    }

    const publishedPost = await db.post.update({
      where: {
        id: params.postId,
        containerId: session?.user?.profile?.containerId,
      },
      data: {
        isPublished: true,
        publishTime: new Date(),
        publisherName: profile?.name,
        publisherImageUrl: profile?.imageUrl,
      },
    });

    if (post.scheduleDateTime && post.scheduleDateTime > new Date()) {
      await db.post.update({
        where: {
          id: params.postId,
          containerId: session?.user?.profile?.containerId,
        },
        data: {
          publishTime: post.scheduleDateTime,
        },
      });
    }

    return NextResponse.json(publishedPost);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}
