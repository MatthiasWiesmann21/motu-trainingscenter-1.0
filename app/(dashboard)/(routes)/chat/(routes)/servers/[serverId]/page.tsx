import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      containerId: session?.user?.profile?.containerId,
      members: {
        some: {
          profileId: profile?.id||'',
          containerId: session?.user?.profile?.containerId,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/chat/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
