import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db"; // Prisma client instance
import authOptions from "@/lib/auth";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH(
  req: Request,
  { params }: { params: { commentId?: string } }
) {
  try {
    // Ensure commentId is provided in params
    if (!params.commentId) {
      return NextResponse.json(
        { message: "Comment ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    // Check if the user is logged in
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await currentProfile();
    const values = await req.json();

    // Find the comment to be updated and ensure it exists
    const existingComment = await db.comment.findUnique({
      where: {
        id: params.commentId,
        profileId: profile?.id,
      },
    });

    if (!existingComment) {
      return NextResponse.json(
        {
          message: "Comment not found or you don't have permission to edit this comment",
        },
        { status: 404 }
      );
    }

    // Update the comment's text
    const updatedComment = await db.comment.update({
      where: { id: existingComment.id },
      data: {
        text: values.text,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("[COMMENT_UPDATE]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
