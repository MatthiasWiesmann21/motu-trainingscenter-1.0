import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import verifyEmailTemplate from "@/email-templates/verify-email";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      throw "Please provide all fields";
    }
    const existingUser = await db.profile.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw "A user with this email already exists";
    }
    // YOU MAY WANT TO ADD SOME VALIDATION HERE
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;
    const token = jwt.sign({ userId }, process.env.NEXTAUTH_SECRET!, {
      expiresIn: "24h",
    });

    const url =
      new URL(request.url)?.origin === "http://localhost:3000"
        ? "https://motu.clubyte.live"
        : new URL(request.url)?.origin;

    // Fetch the container where the domain matches the URL
    const container = await db.container.findFirst({
      where: { domain: url },
    });

    if (!container?.id) {
      throw "Container not found for this domain";
    }

    console.log("Token created for registration", token);
    const user = await db.profile.create({
      data: {
        userId,
        name,
        email,
        password: hashedPassword,
        token,
        // containerId: process.env.CONTAINER_ID || "",
        containerId: container?.id,
        imageUrl: "",
        isOnline: "Online",
        isBanned: "NOT BANNED",
      },
    });

    await sendEmail(name, email, token);
    console.log("User created successfully", user, {
      name,
      email,
      password,
      hashedPassword,
      user,
    });
  } catch (e) {
    console.log("Error occured while registering user", { e });
    let errorMessage = "An error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    if (typeof e == "string") {
      errorMessage = e;
    }
    return NextResponse.json({ error: errorMessage });
  }
  return NextResponse.json({ message: "success" });
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
    console.log("Sending email with token ", token);
    const mail = await transporter.sendMail({
      from: username,
      to: toEmail,
      replyTo: fromEmail,
      subject: `Verify your clybyte account`,
      html: verifyEmailTemplate(name, token),
    });

    console.log({ message: "Success: email was sent", mail });
  } catch (error) {
    console.log("An error occured while sending email:", error);
  }
};
