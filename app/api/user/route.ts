import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import nextAuth from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = nextAuth(authOptions);
    // console.log("User id found" , userId );
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Fetch user data from db
    const useData = await db.profile.findFirst({ where : { id  : userId } });
    const email: any = useData?.email;

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
          imageUrl: useData?.imageUrl || '',
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
