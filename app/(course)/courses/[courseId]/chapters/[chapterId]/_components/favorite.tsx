import { Button } from "@/components/ui/button";
import axios from "axios";
import { Star } from "lucide-react";

const Favorite = ({ chapter, getData }: any) => (
    <Button
      variant="outline"
      onClick={async () => {
        const response = await axios?.post(`/api/favorite/create`, {
          chapterId: chapter?.id,
        });
        if (response?.status === 200) getData();
      }}
      className="h-10 w-10 p-0"
    >
      <Star
        size={24}
        fill={!!chapter?.currentFavorite ? "#FFD700" : "#ffffff00"}
        className="transition duration-200 ease-in-out hover:scale-105"
        style={!!chapter?.currentFavorite ? { color: "#FFD700" } : {}}
      />
    </Button>
);

export default Favorite;