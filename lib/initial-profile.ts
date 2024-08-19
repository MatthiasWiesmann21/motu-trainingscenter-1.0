import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";
import { db } from "./db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  // Attempt to find the existing profile first
  const existingProfile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  

  // If the profile exists, update it
  if (existingProfile) {
    const updatedProfile = await db.profile.update({
      where: {
        userId: user.id,
      },
      data: {
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        isOnline: "Online",
        // You may update other fields as needed
      },
    });
    return updatedProfile;
  } else {
    // If the profile does not exist, create a new one

    const newProfile = await db?.profile?.create({
      data: {
        userId: user.id,
        name: !!user?.username ? `${user?.username}` : "User",
        imageUrl: user?.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        containerId: process.env.CONTAINER_ID!,
        isOnline: "Online",
        isBanned: "NOT BANNED",
      },
    });
    return newProfile;
  }
};
