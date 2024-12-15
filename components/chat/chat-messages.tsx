"use client";

import { Fragment, useRef, ElementRef } from "react";
import { format } from "date-fns";
import { Member, Message, Profile } from "@prisma/client";
import { ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";
import { useLanguage } from "@/lib/check-language";
import ClubyteLoader from "../ui/clubyte-loader";
import { useTheme } from "next-themes";
import { ScrollArea } from "../ui/scroll-area";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string | null;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const currentLanguage = useLanguage();
  const { theme } = useTheme();
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        {theme === "dark" ? (
          <ClubyteLoader className="h-64 w-64" theme="dark" color="101828" />
        ) : (
          <ClubyteLoader className="h-64 w-64" theme="light" color="ffffff" />
        )}
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {currentLanguage.chat_ChatMessages_loading}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {currentLanguage.chat_ChatMessages_error}
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto pt-4">
      <ScrollArea>
        {!hasNextPage && <div className="flex-1" />}
        {!hasNextPage && <ChatWelcome type={type} name={name} />}
        {hasNextPage && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <>
                {theme === "dark" ? (
                  <ClubyteLoader
                    className="h-64 w-64"
                    theme="dark"
                    color="101828"
                  />
                ) : (
                  <ClubyteLoader
                    className="h-64 w-64"
                    theme="light"
                    color="f6f8fa"
                  />
                )}
              </>
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className="my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                {currentLanguage.chat_ChatMessages_loadPreviousMessages}
              </button>
            )}
          </div>
        )}
        <div className="no-scrollbar mt-auto flex flex-col-reverse">
          {data?.pages?.map((group, i) => (
            <Fragment key={i}>
              {group?.items?.map((message: MessageWithMemberWithProfile) => (
                <ChatItem
                  key={message.id}
                  id={message.id}
                  currentMember={member}
                  member={message.member}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                  apiUrl={apiUrl}
                />
              ))}
            </Fragment>
          ))}
        </div>
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  );
};
