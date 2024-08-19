"use client";
import axios from "axios";
import moment from "moment";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChatInputPost } from "../../../news/_components/chatInput";

const Chat = () => {
  const path = usePathname();
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
  return (
    <div className="border-1 w-[30%] rounded border border-[#fff]">
      <p className="text-center">Stream Chat</p>
      <div className="w-full">
        <p className="text-center">Welcome to the chat room!</p>
        <div className="h-[400px] overflow-y-scroll">
          {chat?.map((each, index) => {
            const { createdAt, profile, text } = each;
            const { name } = profile;
            return (
              <p
                key={index}
                className={`${
                  index % 2 === 0 && "bg-[#777]"
                } my-[1%] rounded p-[1%]`}
              >
                <span className="font-light">
                  {moment(new Date(createdAt))?.format("HH:mm")}
                </span>
                <span className="mx-[5px] font-bold">{`${name} :`}</span>
                <span>{text}</span>
              </p>
            );
          })}
        </div>
        <ChatInputPost
          placeHolder={"Type your comment"}
          apiUrl="/api/comment/create"
          query={{
            postId: null,
            parentCommentId: null,
            liveEventId: id,
          }}
          className="pb-[0]"
          getPosts={getChat}
        />
      </div>
    </div>
  );
};

export default Chat;
