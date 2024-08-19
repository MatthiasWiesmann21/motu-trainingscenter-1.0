import Image from "next/image";
import { useState } from "react";
import { UserAvatar } from "@/components/user-avatar";
import LikeComment from "./likeComment";
import { PostPreview } from "@/components/post-preview";
import ClubyteLoader from "@/components/ui/clubyte-loader";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip";

interface PostCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  createdAt: string;
  publisherName: string;
  publisherImageUrl: string;
  colorCode?: string;
  likesCount: number;
  currentLike: boolean;
  commentsWithLikes: any;
  commentsCount: number;
  updateLikeComment: any;
}

export const PostCard = ({
  id,
  title,
  imageUrl,
  category,
  description,
  createdAt,
  publisherName,
  publisherImageUrl,
  colorCode,
  likesCount,
  currentLike,
  commentsWithLikes,
  commentsCount,
  updateLikeComment,
}: PostCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { theme } = useTheme();

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <TooltipProvider>
      <div className="group my-5 h-full overflow-hidden rounded-lg border bg-[#f6f8fa] py-1 hover:shadow-sm dark:border-[#2e3135] dark:bg-[#1b1f23]">
        <div className="group h-full overflow-hidden hover:shadow-sm">
          <div className="m-4 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <UserAvatar
                  src={publisherImageUrl}
                  className="min-h-64 min-w-64 max-w-64 max-h-64"
                />
                <div className="ml-2 flex flex-col justify-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="font-600 mr-2 text-start line-clamp-1 text-base text-black dark:text-white">
                        {publisherName}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm whitespace-normal">
                        {publisherName}
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  <div className="text-xs text-black text-muted-foreground dark:text-white">
                    {createdAt}
                  </div>
                </div>
              </div>
              <div
                className={`flex items-center gap-x-1 rounded-full border px-3 py-2 text-xs font-[600] transition`}
                style={{ borderColor: colorCode }}
              >
                <div className="truncate">{category}</div>
              </div>
            </div>
            <div className="font-400 text-sm text-black dark:text-white">
              <PostPreview value={description} />
            </div>
          </div>
          {imageUrl && (
            <div className="relative flex aspect-video w-full items-center justify-center rounded-md p-2">
              {isImageLoading ? (
                theme === "dark" ? (
                  <ClubyteLoader
                    className="h-64 w-64"
                    theme="dark"
                    color="1b1f23"
                  />
                ) : (
                  <ClubyteLoader
                    className="h-64 w-64"
                    theme="light"
                    color="f6f8fa"
                  />
                )
              ) : null}
              <Image
                priority
                fill
                className={`cover transition-opacity duration-500 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                alt={title}
                src={imageUrl}
                onLoadingComplete={handleImageLoad}
              />
            </div>
          )}
        </div>
        <LikeComment
          id={id}
          likesCount={likesCount}
          currentLike={currentLike}
          commentsWithLikes={commentsWithLikes}
          commentsCount={commentsCount}
          updateLikeComment={updateLikeComment}
        />
      </div>
    </TooltipProvider>
  );
};
