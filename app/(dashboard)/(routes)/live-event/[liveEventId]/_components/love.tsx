"use client";

import { cn } from "@/lib/utils";
import axios from "axios";
import { Heart } from "lucide-react";

const Love = ({ liveEvent, getLiveEvent }: any) => (
  <div className="flex">
    <div
      onClick={async () => {
        const response = await axios?.post(`/api/like/create`, {
          liveEventId: liveEvent?.id,
        });
        if (response?.status === 200) getLiveEvent();
      }}
      className="flex cursor-pointer items-center justify-around rounded-lg border border-[#fff] bg-slate-100 p-2 hover:shadow-sm dark:border-[#1e172a] dark:bg-[#0c0319]"
    >
      <Heart
        size={26}
        fill={!!liveEvent?.currentLike ? "#f43f5e" : "#ffffff00"}
        className={cn(
          "transition duration-200 ease-in-out hover:scale-110", 
          liveEvent?.likes?.length > 0 && "mr-2"
        )}
        style={!!liveEvent?.currentLike ? { color: "#f43f5e" } : {}}
      />
      {liveEvent?.likes?.length > 0 && (
        <span className={`${!!liveEvent?.currentLike ? "text-rose-500" : ""}`}>
          {liveEvent?.likes?.length}
        </span>
      )}
    </div>
  </div>
);

export default Love;