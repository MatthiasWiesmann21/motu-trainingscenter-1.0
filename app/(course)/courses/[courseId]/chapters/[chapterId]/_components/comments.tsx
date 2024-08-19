"use client";
import Image from "next/image";
import React from "react";
import amanda from "@/assets/icons/amanda.jpg";
import { UserAvatar } from "@/components/user-avatar";
import { useSelector } from "react-redux";

const arr = [
  {
    name: "Leonardo  Da Vinci",
    txt: "Loved the course. I've learned some very subtle tecniques, expecially on leaves.",
  },
  {
    name: "Titania  S",
    txt: "I loved the course, it had been a long time since I had experimented with watercolors and now I will do it more often thanks to Kitani Studio",
  },
  {
    name: "Zhirkov",
    txt: "Yes. I just emphasize that the use of Photoshop, for non-users, becomes difficult to follow. What requires a course to master it. Safe and very didactic teacher.",
  },
  {
    name: "Miphoska",
    txt: "I haven't finished the course yet, as I would like to have some feedback from the teacher, about the comments I shared on the forum 3 months ago, and I still haven't had any answer.",
  },
];

// <UserAvatar src={user?.imageUrl} className="mr-2 mt-4 w-[60px]" />
const Comment = ({ comment }: any) => {
  // const user = useSelector((state: any) => state?.user);
  return (
    <div className="my-3 flex pt-2" style={{}}>
      <Image
        priority
        alt="book"
        src={amanda}
        className="h-[60px] w-[60px] rounded rounded-full object-cover"
        objectFit="contain"
      />
      <div className="ml-2 flex w-full flex-col justify-around">
        {!!comment ? (
          <>
            <p className="m-0 text-[16px]">{comment?.name}</p>
            <span className="text-gray-500">
              <p className="m-0 text-[12px]">Today</p>
              <p className="m-0 text-[14px]">{comment?.txt}</p>
            </span>
          </>
        ) : (
          <input placeholder="Add a comment" className="" />
        )}
      </div>
    </div>
  );
};

const Comments = () => (
  <div className="mt-5 py-4 pl-4">
    <div>"In Development"</div>
    <div>{`${arr?.length} Comments`}</div>
    <Comment />
    {arr?.map((each, index) => (
      <Comment key={index} comment={each} />
    ))}
  </div>
);

export default Comments;
