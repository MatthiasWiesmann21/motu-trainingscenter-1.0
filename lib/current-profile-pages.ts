import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
export const currentProfilePages = async (req: NextApiRequest ,res : NextApiResponse) => {
  try{
  // Get the session from NextAuth
  const session = await getServerSession(req , res , authOptions);
  
  // Check if session exists and has a user ID
  if (!session?.user?.id) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  return profile;
  }catch(err){
    console.log("An error occured while accessing current profile:" , err)
  }
  return null;

};
