import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import { currentProfile } from "@/lib/current-profile";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

const SetupPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId!,
    },
  });
  if (container?.clientPackage === "STARTER") {
    return redirect("/dashboard");
  }

  const profile = await currentProfile();
  const server = await db.server.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      containerId: session?.user?.profile?.containerId!,
      members: {
        some: {},
      },
    },
  });
  console.log("Setup page server found" , server );
  const serverwithProfile = await db.server.findFirst({
    where: {
      containerId: session?.user?.profile?.containerId!,
      members: {
        some: {
          profileId: (profile || {}).id,
        },
      },
    },
  });

  if (!server) {
    return <InitialModal />;
  }

  if (server) {
    if (!serverwithProfile) {
      const createMember = await db.member.create({
        data: {
          serverId: server.id,
          profileId: (profile || {}).id || '',
          containerId: session?.user?.profile?.containerId!,
        },
      });
    }
      // Redirect to the dashboard page
    return (
      redirect(`/chat/servers/${server.id}`)
    );
  };
};

export default SetupPage;