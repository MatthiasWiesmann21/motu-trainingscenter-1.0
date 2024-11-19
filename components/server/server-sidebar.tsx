import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
// @ts-ignore
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import { languageServer } from "@/lib/check-language-server";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap: any = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  const currentLanguage = await languageServer();
  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  const server = await db.server.findFirst({
    where: {
      id: serverId,
      containerId: profile.containerId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {},
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  const newMembers = await Promise.all(
    (server?.members as any[]).map(async (member) => {
      const profile = await db.profile.findFirst({
        where: {
          id: member.profileId,
        },
      });
      return { ...member, profile };
    })
  );

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = newMembers.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = newMembers.find(
    (member) => member.profileId === profile.id
  )?.role;

  // console.log("----------", server);

  return (
    <div
      className="flex h-full w-full flex-col bg-slate-200/70 text-primary dark:bg-[#0A0118]"
      // style={{ border: "10px solid red" }}
    >
      <ServerHeader
        servers={servers}
        server={{ ...server, members: newMembers }}
        role={role}
        profile={profile}
      />
      <Separator className="bg-slate-300 dark:bg-zinc-700" />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: `${currentLanguage.serverSidebar_textChannel}`,
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: `${currentLanguage.serverSidebar_videoChannel}`,
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: `${currentLanguage.serverSidebar_audioChannel}`,
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: `${currentLanguage.serverSidebar_member}`,
                type: "member",
                data: newMembers?.map((member) => ({
                  id: member.id,
                  name: member?.profile?.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-slate-300 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label={currentLanguage.chat_serversection_label_text}
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label={currentLanguage.chat_serversection_label_audio}
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label={currentLanguage.chat_serversection_label_video}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!newMembers?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label={currentLanguage.chat_serversection_label_member}
              server={{ ...server, members: newMembers }}
            />
            <div className="space-y-[2px]">
              {newMembers
                ?.filter((member) => member.profileId !== profile.id)
                .map((member) => (
                  <ServerMember
                    key={member.id}
                    member={member}
                    server={server}
                    profileOnlineStatus={profile.isOnline}
                  />
                ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
