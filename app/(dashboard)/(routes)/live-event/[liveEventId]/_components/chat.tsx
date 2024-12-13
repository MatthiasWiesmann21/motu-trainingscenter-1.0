"use client";
import axios from "axios";
import moment from "moment";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { ChatInputPost } from "../../../news/_components/chatInput";
import { UserAvatar } from "@/components/user-avatar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/check-language";

const Chat = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const currentLanguage = useLanguage();
  const id = path?.split("/")[path?.split("/")?.length - 1];
  const [chat, setChat] = useState([]);

  const getChat = async () => {
    const response = await axios?.post(`/api/comment/list`, {
      liveEventId: id,
    });
    setChat(response?.data?.data);
  };

  useEffect(() => {
    getChat();
  }, []);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef?.current?.scrollTo({
        top: scrollRef?.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat]);

  return (
    <div className="border-2 mx-auto mt-4 flex h-[614px] w-[95%] flex-col justify-between rounded-xl bg-white dark:bg-[#131313] p-3 pt-0 lg:w-[29%]">
      <p className="my-4 text-md font-bold">{currentLanguage.liveEvent_chat_title}</p>
      <Separator className="mb-2 bg-slate-300 dark:bg-slate-700" />
      <div className="h-[80%] w-full">
        <div ref={scrollRef} className="no-scrollbar h-full overflow-y-scroll">
          {chat?.map((val: any) => (
            <div key={val?.id}>
              <div className="my-2 flex justify-between rounded-lg border-2 p-3 bg-slate-200 dark:bg-[#131618]">
                <UserAvatar
                  className="mr-3 h-[40px] max-h-[40px] min-h-[40px] w-[40px] min-w-[40px] max-w-[40px]"
                  src={val?.profile?.imageUrl}
                />
                <div className="w-full">
                  <div className="">
                    <div className="font-500 line-clamp-1 text-base font-bold">
                      {val?.profile?.name}
                    </div>
                    <div className="text-xs">
                      {moment(new Date(val?.createdAt))?.fromNow()}
                    </div>
                    <text className="break-all text-sm">{val?.text}</text>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ChatInputPost
        placeHolder={currentLanguage.liveEvent_chat_inputField}
        apiUrl="/api/comment/create"
        query={{
          postId: null,
          parentCommentId: null,
          liveEventId: id,
        }}
        className="pb-0"
        getPosts={getChat}
      />
    </div>
  );
};

export default Chat;
