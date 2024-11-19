
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";

export async function POST(req: Request) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    // Extract userId from the session
    const userId = session?.user?.id;
    const { title } = await req.json();

    // Check if userId exists and if the user is the owner
    if (!userId || !await isOwner(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create the post in the database
    const post = await db.post.create({
      data: {
        title,
        containerId: session?.user?.profile?.containerId,
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
