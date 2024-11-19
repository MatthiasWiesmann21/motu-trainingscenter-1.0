import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin } from "@/lib/roleCheckServer"; // Assuming isOperator is not needed, remove if unnecessary
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export async function DELETE(
  req: Request,
  { params }: { params: { containerId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId || !await isOwner(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const container = await db.container.findUnique({
      where: {
        id: params.containerId,
      }
    });

    if (!container) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedContainer = await db.container.delete({
      where: {
        id: params.containerId,
      },
    });

    return NextResponse.json(deletedContainer);
  } catch (error) {
    console.log("[CONTAINER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { containerId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { containerId } = params;
    const values = await req.json();

    const isRoleAdmins = await isAdmin();
    const isRoleClientAdmin = await isClientAdmin();
    const canAccess = isRoleAdmins || isRoleClientAdmin || await isOwner(userId);

    if (!userId || !canAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const container = await db.container.update({
      where: {
        id: containerId,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(container);
  } catch (error) {
    console.log("[CONTAINER_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { containerId: string } }
) {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }
  
  const container = await db.container.findFirst({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  return NextResponse.json({ icon: container?.icon });

}
