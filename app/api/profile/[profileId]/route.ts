import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin } from "@/lib/roleCheckServer";
import bcrypt from "bcrypt";

export async function DELETE(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const isRoleAdmins = await isAdmin();
    const isRoleClientAdmin = await isClientAdmin();
    const canAccess = isRoleAdmins || isRoleClientAdmin || (userId && (await isOwner(userId)));
    const profile = await db.profile.findUnique({
      where: {
        id: params.profileId,
      },
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
    console.log("[PROFILE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const values = await req.json();

    if (values?.password) {
      const existingProfile: any = await db.profile.findUnique({
        where: {
          id: params.profileId,
          containerId: session?.user?.profile?.containerId,
        },
      });

      if (!existingProfile) {
        return NextResponse.json(
          { message: "Profile not found" },
          { status: 404 }
        );
      }

      const isSamePassword = await bcrypt.compare(
        values.password,
        existingProfile.password
      );

      if (isSamePassword) {
        return NextResponse.json(
          { message: "Exisiting Password" },
          { status: 400 }
        );
      }
    }

    // const hashedPassword = await bcrypt.hash(values.password, 10);
    const profile = await db.profile.update({
      where: {
        id: params.profileId,
        containerId: session?.user?.profile?.containerId,
      },
      data: {
        ...values,
        ...(values.password && {
          password: await bcrypt.hash(values.password, 10),
        }),
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[PROFILE_UPDATE]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
