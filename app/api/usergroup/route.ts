import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";

export async function POST(req: Request) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    // Check roles and access permissions
    const isRoleClientAdmin = await isClientAdmin();
    const isRoleAdmins = await isAdmin();
    const isRoleOperator = await isOperator();
    const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || isOwner(userId);

    if (!canAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create the UserGroup
    const usergroup = await db.usergroup.create({
      data: {
        name,
        containerId: session?.user?.profile?.containerId!,
      }
    });

    return NextResponse.json(usergroup);
  } catch (error) {
    console.log("[USERGROUP_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
