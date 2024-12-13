"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ClubyteLoader from "./ui/clubyte-loader";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Info,
  Lightbulb,
  Medal,
  MoreVertical,
  Pencil,
  Share2,
  Star,
  Trash,
} from "lucide-react";
import { useLanguage } from "@/lib/check-language";
import { formatDuration } from "@/lib/formatDuration";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useIsAdmin, useIsClientAdmin } from "@/lib/roleCheck";
import { ConfirmModal } from "./modals/confirm-modal";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DescriptionModal } from "./modals/description-modal";
import { ShareLinkModal } from "./modals/share-link-modal";
import { CourseInfoModal } from "./modals/course-info-modal";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  chaptersLength: number;
  duration: string;
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
  getAllCourses?: any;
}

export const CourseCard = ({
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
}: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const currentLanguage = useLanguage();
  const isAdmin = useIsAdmin();
  const isClientAdmin = useIsClientAdmin();
  const router = useRouter();

  const canAccess = isAdmin || isClientAdmin;

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
        className="w-full rounded-lg border-2 transition duration-300 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderColor: isHovered ? getThemeColor() : "",
        }}
      >
        <div className="group h-full w-full overflow-hidden rounded-lg bg-white p-2 transition hover:shadow-lg dark:bg-[#0c0319]">
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

          <div className="mt-3 flex w-full items-center justify-between">
            {category && (
              <Tooltip>
                <TooltipTrigger>
                  <span
                    style={{ borderColor: categoryColorCode }}
                    className="line-clamp-1 max-w-[150px] rounded-lg border-2 px-2 py-1 text-start text-xs"
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
            )}
            <div className="flex items-center justify-between">
              {getAllCourses && (
                <Star
                  size={16}
                  fill={!!currentFavorite ? "#FFD700" : "#ffffff00"}
                  className="mx-1 h-7 w-7 cursor-pointer rounded-md p-1 transition duration-200 ease-in-out hover:scale-110 hover:bg-slate-200 dark:hover:bg-slate-700"
                  style={!!currentFavorite ? { color: "#FFD700" } : {}}
                  onClick={async () => {
                    const response = await axios?.post(`/api/favorite/create`, {
                      courseId: id,
                    });
                    if (response?.status === 200) getAllCourses();
                  }}
                />
              )}
              <ShareLinkModal id={id} path={"/courses"}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Share2 width={16} height={16} />
                </Button>
              </ShareLinkModal>
              <CourseInfoModal
                description={description}
                title={title}
                chapters={chaptersLength}
                duration={duration}
                level={level}
                ThemeColor={ThemeColor}
                DarkThemeColor={DarkThemeColor}
              >
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info width={16} height={16} />
                </Button>
              </CourseInfoModal>
              {canAccess && (
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
            <div className="mt-1">
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-md mx-0.5 my-2 line-clamp-2 text-start font-semibold">
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
              <div className="xs:grid-cols-2 grid gap-1 lg:grid-cols-3">
                <div className="flex items-center">
                  <BookOpen
                    className="h-4 w-4" // fixed width and height (e.g., w-5 = 20px)
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
                      className="h-4 w-4" // ensure fixed width and height here as well
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
                      className="h-4 w-4" // fixed size for GraduationCap
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
