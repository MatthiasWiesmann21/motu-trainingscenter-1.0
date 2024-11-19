
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Check if the userId exists
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
    console.log("[POST_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { postId } = params;
    const values = await req.json();

    // Check if the userId exists
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await db.post.update({
      where: {
        id: postId,
        containerId: session?.user?.profile?.containerId,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_ID_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
