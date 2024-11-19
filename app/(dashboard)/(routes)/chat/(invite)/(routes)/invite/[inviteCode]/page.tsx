import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  if (!params.inviteCode) {
    return redirect("/search"); // Redirect to search if invite code is not provided
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      containerId: session?.user?.profile?.containerId!,
      members: {
        some: {
          profileId: profile?.id||''
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/chat/servers/${existingServer.id}`); // Redirect to the server if it exists
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile?.id||'',
            containerId: session?.user?.profile?.containerId!,
          }
        ]
      }
    }
  });

  if (server) {
    return redirect(`/chat/servers/${server.id}`); // Redirect to the newly created server
  }

  return null; // If no server created, return null
}

export default InviteCodePage;
