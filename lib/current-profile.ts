import { db } from "@/lib/db";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { json } from "stream/consumers";
export const currentProfile = async () => {
  try {
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) 
    {   
      return null;
    }
    const profile = await db?.profile?.findFirst({
      where: { 
        userId: session.user.id ,
        containerId: session?.user?.profile?.containerId
      },
      include: {
        container: true,
      }
    });

    if (!profile) {
      return null;
    }
    return profile;
  } catch (error) {
    // console.log("An error occurred in current profile" , error );
    return null;
  }
};

// export const currentProfile = async () => {
//   const { userId } = auth();

//   if (!userId) {
//     return null;
//   }

//   const profile = await db.profile.findUnique({
//     where: {
//       userId,
//       containerId: process.env.CONTAINER_ID
//     }
//   });

//   return profile;
// }