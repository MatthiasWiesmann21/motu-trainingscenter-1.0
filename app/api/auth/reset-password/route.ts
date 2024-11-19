import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { token, password, confirmPassword } = await request.json();
    // console.log("Password reset request", { token, password, confirmPassword });
    
    if (!token || !password || !confirmPassword) {
      throw "Please provide all fields";
    }
    
    if (password !== confirmPassword) {
      throw "Passwords do not match";
    }

    const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    if (!decodedToken || typeof decodedToken !== 'object') {
      throw "Invalid or expired token";
    }
    
    const user = await db.profile.findFirst({
        where: {
          token: token,
        },
      });
  
      if (!user) {
        throw "Invalid or expired token";
      }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.profile.update({
        where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log("Password reset successfully for user", user);

  } catch (e) {
    console.log("Error occurred during password reset", { e });
    let errorMessage = "An error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    if (typeof e == "string") {
      errorMessage = e;
    }
    return NextResponse.json({ error: errorMessage });
  }

  return NextResponse.json({ message: "Password reset successful" });
}
