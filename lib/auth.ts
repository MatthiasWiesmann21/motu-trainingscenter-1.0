// lib/auth.ts
import { db } from "@/lib/db";
import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcrypt";
import toast from "react-hot-toast";

type Credentials = {
  email?: string;
  password?: string;
};
type JWT = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  iat?: number;
  exp?: number;
};

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials: Credentials | undefined, req) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        const { email, password } = credentials;
        const user = await db.profile.findFirst({
          where: {
            email: {
              equals: email
            },
          },
        });

        if (!user) {
          throw new Error("No user found with the provided email");
        }

        // Validate password
        const isValidPassword = bcrypt.compareSync(password || "", user.password || "");
        if (!isValidPassword) {
          throw new Error("Invalid credentials provided");
        }

        // Check if the user is banned
        if (user.isBanned === 'BANNED') {
          throw new Error("You are not allowed to access the app. Please contact administrator.");
        }

        // Return user object if everything is fine
        return {
          id: user.userId,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
          isBanned : user.isBanned
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        const existingProfile = await db.profile.findFirst({
          where: { email: user.email },
        });

        if (!existingProfile) {
          await db.profile.create({
            data: {
              userId: user.id, // The user ID from Google
              email: user.email,
              name: user.name || "",
              imageUrl: user.image || "", // Add a default image if needed
              isOnline: "Online",
              role: "USER",
              emailVerified: true,
              isBanned: "NOT BANNED",
              containerId: process.env.CONTAINER_ID || '',  // Assign appropriate containerId
            },
          });
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;

        const userProfile = await db.profile.findFirst({
          where: { userId: token.id },
        });

        if (userProfile) {
          session.user.profile = userProfile;
          if(!session.user.role){
            session.user.role = userProfile.role;
          }
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    error: "/auth/error",
  },
};

export default authOptions;
