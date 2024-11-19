import { ServerSidebar } from "@/components/server/server-sidebar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import  authOptions  from "@/lib/auth";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export const SidebarChat = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="flex h-full w-full flex-row overflow-y-auto border-r bg-white shadow-sm dark:bg-[#1e1f22]">
      <div>
        <ServerSidebar serverId={serverId} />
      </div>
    </div>
  );
};
