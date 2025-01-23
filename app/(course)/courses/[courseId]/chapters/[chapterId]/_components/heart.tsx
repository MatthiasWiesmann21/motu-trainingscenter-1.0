import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Heart } from "lucide-react";

const Love = ({ chapter, getData }: any) => (
    <Button
      variant="outline"
      onClick={async () => {
        const response = await axios?.post(`/api/like/create`, {
          chapterId: chapter?.id,
        });
        if (response?.status === 200) getData();
      }}
      className="flex h-10 min-w-xs px-2"
    >
      <Heart
        size={24}
        fill={!!chapter?.currentLike ? "#f43f5e" : "#ffffff00"}
        className={cn("transition duration-200 ease-in-out hover:scale-105", 
          chapter?.likes?.length > 0 && "mr-2"
        )}
        style={!!chapter?.currentLike ? { color: "#f43f5e" } : {}}
      />
      {chapter?.likes?.length > 0 && (
        <span className={`${!!chapter?.currentLike ? "text-rose-500" : ""}`}>
          {chapter?.likes?.length}
        </span>
      )}
    </Button>
);

export default Love;