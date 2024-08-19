import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/search");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      containerId: process.env.CONTAINER_ID,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/chat/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
            containerId: process.env.CONTAINER_ID || '',
          }
        ]
      }
    }
  });

  if (server) {
    return redirect(`/chat/servers/${server.id}`);
  }
  
  return null;
}
 
export default InviteCodePage;