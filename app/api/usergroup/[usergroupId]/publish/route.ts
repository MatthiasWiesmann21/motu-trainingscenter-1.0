import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function PATCH(
  req: Request,
  { params }: { params: { usergroupId: string } }
) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the UserGroup exists
    const usergroup = await db.usergroup.findUnique({
      where: {
        id: params.usergroupId,
        containerId: session?.user?.profile?.containerId!,
      }
    });

    if (!usergroup) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the UserGroup to be published
    const publishedUsergroup = await db.usergroup.update({
      where: {
        id: params.usergroupId,
        containerId: session?.user?.profile?.containerId!,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedUsergroup);
  } catch (error) {
    console.log("[USERGROUP_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
