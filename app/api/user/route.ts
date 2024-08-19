import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Fetch user data from Clerk
    const userClerk = await clerkClient.users.getUser(userId);
    const email: any = userClerk.emailAddresses.find(
      (email) => email.id === userClerk.primaryEmailAddressId
    )?.emailAddress;

    // Fetch user profile from your database
    let user: any = await db.profile.findFirst({
      where: { userId: userId },
      include: {
        container: true,
      },
    });

    // If user does not exist, create a new user
    if (!user) {
      user = await db.profile.create({
        // @ts-ignore
        data: {
          userId: userId,
          email: email,
          imageUrl: userClerk?.profileImageUrl,
          containerId: process.env.CONTAINER_ID,
          name: "name",
          // add other fields if necessary
        },
        include: {
          container: true,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[Get User]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
