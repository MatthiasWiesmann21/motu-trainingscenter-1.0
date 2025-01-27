"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Star } from "lucide-react";

const Favorite = ({ liveEvent, getLiveEvent }: any) => (
  <Button
      variant="outline"
      onClick={async () => {
        const response = await axios?.post(`/api/favorite/create`, {
          liveEventId: liveEvent?.id,
        });
        if (response?.status === 200) getLiveEvent();
      }}
      className="h-10 w-10 p-0"
    >
      <Star
        size={24}
        fill={!!liveEvent?.currentFavorite ? "#FFD700" : "#ffffff00"}
        className="transition duration-200 ease-in-out hover:scale-105"
        style={!!liveEvent?.currentFavorite ? { color: "#FFD700" } : {}}
      />
    </Button>
);

export default Favorite;