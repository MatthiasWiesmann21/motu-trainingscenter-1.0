"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { formatDuration } from "@/lib/formatDuration";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/check-language";

interface LinkedCourseProps {
  courseId: string;
  ThemeColor: string;
  DarkThemeColor: string;
}

interface CourseData {
  id: string;
  title: string;
  imageUrl: string | null;
  duration: string | null;
  level: string | null;
  chaptersCount: number;
  category: {
    name: string;
    colorCode: string;
    textColorCode: string;
  } | null;
}

export const LinkedCourse = ({
  courseId,
  ThemeColor,
  DarkThemeColor,
}: LinkedCourseProps) => {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const currentLanguage = useLanguage();

  const getThemeColor = () => {
    return theme === "dark" ? DarkThemeColor : ThemeColor;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="m-4 p-4 h-24 animate-pulse rounded-lg bg-gray-200" />
    );
  }

  if (!course) {
    return null;
  }

  return (
    <Card className="m-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {course.imageUrl && (
          <div className="relative w-full aspect-[16/9] lg:col-span-1 overflow-hidden rounded-md">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-between lg:col-span-3">
          <div className="space-y-2">
            {course.category && (
              <Tooltip>
                <TooltipTrigger>
                  <span
                    style={{ borderColor: course.category.colorCode }}
                    className="line-clamp-1 inline-block rounded-lg border-2 px-2 py-1 mr-1 text-start text-xs"
                  >
                    {course.category.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="whitespace-normal text-sm font-semibold">
                    {course.category.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            <h3 className="text-lg line-clamp-2 text-start font-semibold">
              {course.title}
            </h3>
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-y-4 xl:gap-y-0">
              <div className="flex flex-col xl:flex-row xl:items-center gap-y-2 xl:gap-x-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-x-2">
                  <BookOpen className="h-4 w-4" style={{ color: getThemeColor() }} />
                  <span>
                    {course.chaptersCount} {course.chaptersCount === 1 ? `${currentLanguage.course_card_chapter}` : `${currentLanguage.course_card_chapters}`}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <Clock className="h-4 w-4" style={{ color: getThemeColor() }} />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <GraduationCap className="h-4 w-4" style={{ color: getThemeColor() }} />
                  <span>{course.level}</span>
                </div>
              </div>
              <Link href={`/courses/${course.id}`}>
                <Button variant="outline" className="transition-all hover:bg-slate-200/20">
                  {currentLanguage.linkedCourse_button_viewCourse}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};