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
import { Profile } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useLanguage } from "@/lib/check-language";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useIsAdmin, useIsClientAdmin } from "@/lib/roleCheck";
import { LinkedCourse } from "./linked-course";
import { LinkedLiveEvent } from "./linked-live-event";

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
  favoritesCount: number;
  currentLike: boolean;
  currentFavorite: boolean;
  commentsWithLikes: any;
  commentsCount: number;
  updateLikeComment: any;
  profileImage: string;
  currentProfileId: string;
  courseId?: string;
  liveEventId?: string;
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
  currentFavorite,
  commentsWithLikes,
  commentsCount,
  updateLikeComment,
  profileImage,
  currentProfileId,
  courseId,
  liveEventId,
}: PostCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { theme } = useTheme();
  const currentLanguage = useLanguage();
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const isClientAdmin = useIsClientAdmin();

  const canAccess = isAdmin || isClientAdmin;

  const onDelete = async () => {
    try {
      await axios.delete(`/api/posts/${id}`);
      toast.success("Post deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <TooltipProvider>
      <div className="group my-4 h-full overflow-hidden rounded-lg border-2 bg-white py-1 dark:border-[#2e3135] dark:bg-[#1b1f23]">
        <div className="group h-full overflow-hidden">
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
                      <div className="font-600 mr-2 line-clamp-1 text-start text-base text-black dark:text-white">
                        {publisherName}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="whitespace-normal text-sm">
                        {publisherName}
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  <div className="text-xs text-black text-muted-foreground dark:text-white">
                    {createdAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger>
                    {category && (
                      <div
                        className={`flex items-center rounded-lg border-2 px-3 py-1 text-xs`}
                        style={{ borderColor: colorCode }}
                      >
                        <div className="truncate">{category}</div>
                      </div>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="whitespace-normal text-sm">{category}</div>
                  </TooltipContent>
                </Tooltip>
                {canAccess && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="ml-2 h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/admin/posts/${id}`}>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          {currentLanguage.course_card_edit}
                        </DropdownMenuItem>
                      </Link>
                      <ConfirmModal onConfirm={onDelete}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex w-full justify-start p-2"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          {currentLanguage.course_card_delete}
                        </Button>
                      </ConfirmModal>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <div className="font-400 mt-6 text-sm text-black dark:text-white">
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
                    color="ffffff"
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
          {courseId && <LinkedCourse courseId={courseId} />}
          {liveEventId && <LinkedLiveEvent eventId={liveEventId} />}
        </div>
        <LikeComment
          id={id}
          profileImage={profileImage}
          likesCount={likesCount}
          currentLike={currentLike}
          currentFavorite={currentFavorite}
          commentsWithLikes={commentsWithLikes}
          commentsCount={commentsCount}
          updateLikeComment={updateLikeComment}
          currentProfileId={currentProfileId}
        />
      </div>
    </TooltipProvider>
  );
};