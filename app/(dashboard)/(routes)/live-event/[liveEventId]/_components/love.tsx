"use client";

import { cn } from "@/lib/utils";
import axios from "axios";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Love = ({ liveEvent, getLiveEvent }: any) => (
  <Button
      variant="outline"
      onClick={async () => {
        const response = await axios?.post(`/api/like/create`, {
          liveEventId: liveEvent?.id,
        });
        if (response?.status === 200) getLiveEvent();
      }}
      className="flex h-10 min-w-xs px-2"
    >
      <Heart
        size={24}
        fill={!!liveEvent?.currentLike ? "#f43f5e" : "#ffffff00"}
        className={cn("transition duration-200 ease-in-out hover:scale-105", 
          liveEvent?.likes?.length > 0 && "mr-2"
        )}
        style={!!liveEvent?.currentLike ? { color: "#f43f5e" } : {}}
      />
      {liveEvent?.likes?.length > 0 && (
        <span className={`${!!liveEvent?.currentLike ? "text-rose-500" : ""}`}>
          {liveEvent?.likes?.length}
        </span>
      )}
    </Button>
);

export default Love;