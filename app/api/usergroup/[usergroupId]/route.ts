import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function DELETE(
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
        containerId: session?.user?.profile?.containerId,
      }
    });

    if (!usergroup) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Delete the UserGroup
    const deletedUsergroup = await db.usergroup.delete({
      where: {
        id: params.usergroupId,
        containerId: session?.user?.profile?.containerId,
      },
    });

    return NextResponse.json(deletedUsergroup);
  } catch (error) {
    console.log("[USERGROUP_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    const { usergroupId } = params;
    const values = await req.json();

    // Update the category
    const usergroup = await db.usergroup.update({
      where: {
        id: usergroupId,
        containerId: session?.user?.profile?.containerId!,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(usergroup);
  } catch (error) {
    console.log("[USERGROUP_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
