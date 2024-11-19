import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { isOwner } from "@/lib/owner";

export async function POST(
  req: Request,
) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Extract data from the request
    const { name, imageUrl, link, clientPackage, maxCourses } = await req.json();

    // Check if the user is authenticated and an owner
    if (!userId || !await isOwner(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create a new container
    const container = await db.container.create({
      data: {
        name,
        imageUrl,
        link,
        clientPackage,
        maxCourses,
      }
    });

    // Return the newly created container
    return NextResponse.json(container);
  } catch (error) {
    console.log("[CONTAINER_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  return NextResponse.json({ icon: container?.icon });
}
