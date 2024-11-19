import Image from "next/image";
import { useState } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { PostPreview } from "@/components/post-preview";
import ClubyteLoader from "@/components/ui/clubyte-loader";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/lib/check-language";
import { useIsAdmin } from "@/lib/roleCheck";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { BookOpen, Clock, GraduationCap, Info, Lightbulb, Medal, MoreVertical, Pencil, Star, Trash } from "lucide-react";
import { DescriptionModal } from "@/components/modals/description-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { CourseProgress } from "@/components/course-progress";
import { formatPrice } from "@/lib/format";
import { formatDuration } from "@/lib/formatDuration";

interface CourseFavoriteCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  chaptersLength: number;
  duration: number;
  level: string;
  price: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  progress: number | null;
  category: string;
  categoryColorCode: string;
  currentFavorite: boolean;
  ThemeColor: string;
  DarkThemeColor: string;
  getAllCourses: any;
}

export const CourseFavoriteCard = ({
  id,
  title,
  imageUrl,
  description,
  chaptersLength,
  duration,
  level,
  isFeatured,
  isBestseller,
  isNew,
  price,
  progress,
  category,
  categoryColorCode,
  currentFavorite,
  ThemeColor,
  DarkThemeColor,
  getAllCourses,
}: CourseFavoriteCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const currentLanguage = useLanguage();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${id}`);
      toast.success("Course deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeColor : ThemeColor;
  };

  return (
    <TooltipProvider>
      <div
        className="w-full my-2 rounded-lg border-2 transition duration-500 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderColor: isHovered ? getThemeColor() : "",
        }}
      >
        <div className="group h-full w-full overflow-hidden rounded-lg bg-slate-100/80 p-2 transition dark:bg-[#0c0319]">
          <Link href={`/courses/${id}`}>
            <div className="relative aspect-video w-full overflow-hidden rounded-md border-2 border-slate-300/50 dark:border-slate-700/60">
              <div className="absolute left-2 top-2 z-10 flex space-x-2">
                {isBestseller && (
                  <p className="flex rounded-md bg-yellow-500 p-1 text-sm font-medium text-white">
                    <Medal className="pr-1" width={18} height={18} />
                    {currentLanguage.course_card_bestseller}
                  </p>
                )}
                {isNew && (
                  <p className="flex rounded-md bg-rose-600 p-1 text-sm font-medium text-white dark:bg-rose-600 dark:text-white">
                    <Lightbulb className="pr-1" width={18} height={18} />
                    {currentLanguage.course_card_new}
                  </p>
                )}
                {isFeatured && (
                  <p className="flex rounded-md bg-blue-500 p-1 text-sm font-medium text-white">
                    <Star className="pr-1" width={18} height={18} />
                    {currentLanguage.course_card_featured}
                  </p>
                )}
              </div>
              {/* Show a placeholder or spinner while the image is loading */}
              {isLoading && (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {theme === "dark" ? (
                      <ClubyteLoader
                        className="h-64 w-64"
                        theme="dark"
                        color="0c0319"
                      />
                    ) : (
                      <ClubyteLoader
                        className="h-64 w-64"
                        theme="light"
                        color="f7f9fb"
                      />
                    )}
                  </span>
                </div>
              )}
              <Image
                fill
                className={`object-cover transition-opacity duration-500 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                alt={title}
                src={imageUrl}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </div>
          </Link>

          <div className="mt-3 flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger>
                <span
                  style={{ borderColor: categoryColorCode }}
                  className="line-clamp-1 max-w-[130px] rounded-lg border-2 px-3 py-1 text-start text-xs"
                >
                  {category}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="whitespace-normal text-sm font-semibold">
                  {category}
                </p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center justify-between">
              <Star
                size={16}
                fill={!!currentFavorite ? "#FFD700" : "#ffffff00"}
                className="mx-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 w-7 h-7 p-1 rounded-md transition duration-200 ease-in-out hover:scale-110"
                style={!!currentFavorite ? { color: "#FFD700" } : {}}
                onClick={async () => {
                  const response = await axios?.post(`/api/favorite/create`, {
                    courseId: id,
                  });
                  if (response?.status === 200) getAllCourses();
                }}
              />
              <DescriptionModal description={description}>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info width={16} height={16} />
                </Button>
              </DescriptionModal>
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/admin/courses/${id}`}>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        {currentLanguage.course_card_edit}
                      </DropdownMenuItem>
                    </Link>
                    <ConfirmModal onConfirm={onDelete}>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isLoading}
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

          <Link href={`/courses/${id}`}>
            <div className="mt-2 flex flex-col">
              <Tooltip>
                <TooltipTrigger>
                  <p className="my-2 mx-0.5 line-clamp-2 text-start text-[16px] font-semibold">
                    {title}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-2">
                  <p className="whitespace-normal text-sm font-semibold">
                    {title}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {/* First row: chapterLength, duration, level */}
              <div className="grid grid-cols-1 gap-1">
                <div className="flex items-center">
                  <BookOpen
                    width={14}
                    height={14}
                    style={{ color: getThemeColor() }}
                  />
                  <span className="ml-1 text-xs">
                    {chaptersLength}{" "}
                    {chaptersLength < 2
                      ? currentLanguage.course_card_chapter
                      : currentLanguage.course_card_chapters}
                  </span>
                </div>
                {duration && (
                  <div className="flex items-center">
                    <Clock
                      width={14}
                      height={14}
                      style={{ color: getThemeColor() }}
                    />
                    <span className="ml-1 text-xs">
                      {formatDuration(duration.toString())}
                    </span>
                  </div>
                )}
                {level && (
                  <div className="flex items-center">
                    <GraduationCap
                      width={14}
                      height={14}
                      style={{ color: getThemeColor() }}
                    />
                    <span className="ml-1 text-xs">
                      {level || currentLanguage.course_card_no_level}
                    </span>
                  </div>
                )}
              </div>

              {/* Second row: Price or Progress */}
              <div>
                {progress !== null ? (
                  <CourseProgress
                    variant={progress === 100 ? "success" : "default"}
                    size="sm"
                    value={progress}
                  />
                ) : (
                  <p className="my-1 text-[16px] font-bold text-slate-700 dark:text-slate-200 md:text-sm">
                    {price === 0 ? "Free" : formatPrice(price)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
};