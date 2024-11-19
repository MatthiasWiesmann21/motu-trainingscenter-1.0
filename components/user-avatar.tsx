import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import profileNot from "@/assets/icons/profileNot.png";
import { AspectRatio } from "./ui/aspect-ratio";

interface UserAvatarProps {
  src?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, className }) => {
  return (
    <Avatar className={cn("relative h-7 w-7 md:h-10 md:w-10", className)}>
      {src ? (
        <AvatarImage src={src} />
      ) : (
        <AspectRatio ratio={1 / 1}>
          <Image priority alt="profileNot" src={profileNot} />
        </AspectRatio>
      )}
    </Avatar>
  );
};
