import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";
import { isAdmin } from "@/lib/roleCheckServer";

export async function DELETE(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { userId } = auth();

    const isRoleAdmins = await isAdmin();
    const canAccess = isRoleAdmins || isOwner(userId);

    if (!userId || !canAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: {
        id: params.profileId,
      }
    });

    if (!profile) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedProfile = await db.profile.delete({
      where: {
        id: params.profileId,
      },
    });

    return NextResponse.json(deletedProfile);
  } catch (error) {
    console.log("[CONTAINER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { userId } = auth();
    const { profileId } = params;
    const values = await req.json();

    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(values);

    const profile = await db.profile.update({
      where: {
        id: profileId,
        containerId: process.env.CONTAINER_ID,
      },
      data: {
        ...values
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[PROFILE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}