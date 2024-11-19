import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";

export async function GET(req: any): Promise<void | Response> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Session not found", { status: 404 });
      //   return null;
    }
    const profile = await db?.profile?.findFirst({
      where: {
        userId: session.user.id,
        containerId: session?.user?.profile?.containerId,
      },
      include: {
        container: true,
      },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
      //   return null;
    }

    // return NextResponse.json(profile);
    // return profile;
    return NextResponse.json(profile);
  } catch (error) {
    console.log("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
