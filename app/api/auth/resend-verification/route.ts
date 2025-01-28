import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import verifyEmailTemplate from "@/email-templates/verify-email";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      throw "User ID is required";
    }

    const user = await db.profile.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw "User not found";
    }

    if (user.emailVerified) {
      throw "Email is already verified";
    }

    // Generate new token
    const token = jwt.sign({ userId: user.userId }, process.env.NEXTAUTH_SECRET!, {
      expiresIn: "24h",
    });

    // Update user's token
    await db.profile.update({
      where: {
        id: userId,
      },
      data: {
        token,
      },
    });

    // Send verification email
    await sendEmail(user.name || "", user.email, token);

    return NextResponse.json({ message: "Verification email sent successfully" });
  } catch (e) {
    console.log("Error occurred while resending verification email", { e });
    let errorMessage = "An error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    if (typeof e === "string") {
      errorMessage = e;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

const sendEmail = async (name: string, toEmail: string, token: string) => {
  const username = process.env.NEXT_PUBLIC_EMAIL_USERNAME;
  const password = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
  const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL;
  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_EMAIL_HOST,
    port: ~~process.env.NEXT_PUBLIC_EMAIL_PORT!,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: username,
      pass: password,
    },
  });

  try {
    console.log("Sending verification email with token", token);
    const mail = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: "Verify Your Email",
      html: verifyEmailTemplate(name, token),
    });
    console.log("Email sent successfully", mail.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw "Failed to send verification email";
  }
};