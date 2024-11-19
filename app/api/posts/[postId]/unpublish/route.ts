import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth"; // Make sure this path is correct for your NextAuth configuration

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await db.post.findUnique({
      where: {
        id: params.postId,
        containerId: session?.user?.profile?.containerId,
      }
    });

    if (!post) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedPost = await db.post.delete({
      where: {
        id: params.postId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    return NextResponse.json(deletedPost);
  } catch (error) {
    console.log("[POST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await db.post.findUnique({
      where: {
        id: params.postId,
        containerId: session?.user?.profile?.containerId,
      }
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
        isPublished: false,
      }
    });

    return NextResponse.json(publishedPost);
  } catch (error) {
    console.log("[POST_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}
