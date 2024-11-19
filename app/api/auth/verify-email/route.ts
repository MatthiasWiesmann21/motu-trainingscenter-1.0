import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Utility functions (not exported directly)
async function getTokenFromDatabase(token: string) {
  return db.profile.findFirst({ where: { token } });
}

async function verifyToken(token: string, tokenDetails: any) {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    return decoded && decoded.userId === tokenDetails.userId;
  } catch (error) {
    console.log("Verify token error occurred", error);
    return false;
  }
}

async function updateUserEmailVerifiedStatus(userId: string) {
  console.log("Updating user email verified status", userId);
  return db.profile.update({
    where: { id: userId.trim() },
    data: { emailVerified: true },
  });
}
async function resetToken(userId: string) {
  return db.profile.update({
    where: { id: userId },
    data: { token: "" },
  });
}
// API Route Handler
export async function GET(req: Request) {
  const url = new URL(req.url);
  let token = url.searchParams.get("token")?.trim() || "";

  if (!token) {
    return NextResponse.json({ message: "Token is required" });
  }

  try {
   const tokenDetails = await getTokenFromDatabase(token);

    if (!tokenDetails) {
      return NextResponse.json({ message: "Invalid or expired token" });
    }

    const isValid = await verifyToken(token, tokenDetails);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid or expired token" });
    }

    const verifiedNow = await updateUserEmailVerifiedStatus(tokenDetails.id);
    const tokenReset = await resetToken(tokenDetails.id);

    return NextResponse.redirect(`${process.env.BASE_PATH}/auth/email-verified`, 307);
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
}