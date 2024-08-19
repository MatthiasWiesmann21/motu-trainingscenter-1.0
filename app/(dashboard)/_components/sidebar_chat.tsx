import Image from "next/image";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export const SidebarChat = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }
  return (
    <div className="flex h-full w-full flex-row overflow-y-auto border-r bg-white shadow-sm dark:bg-[#1e1f22] ">
      <div className="">
        <NavigationSidebar />
      </div>
      <div className="">
        <ServerSidebar serverId={serverId} />
      </div>
    </div>
  );
};
