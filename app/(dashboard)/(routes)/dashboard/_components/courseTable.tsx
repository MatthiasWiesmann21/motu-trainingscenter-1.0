"use client";
import { Line } from "rc-progress";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/check-language";
import { BookX, Eye } from "lucide-react";
import { Container, Course } from "@prisma/client";
import { useTheme } from "next-themes";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CourseTableProps {
  courses: Course[];
  colors: Container | any;
}

const CourseTable = ({ courses, colors }: CourseTableProps) => {
  const currentLanguage = useLanguage();
  const maxCourses = 5;
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
  const { theme } = useTheme();

  const sortedCourses = courses.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getButtonColor = () => {
    if (theme === "dark") {
      return colors?.DarkPrimaryButtonColor;
    }
    return colors?.PrimaryButtonColor;
  };

  const getThemeColor = () => {
    if (theme === "dark") {
      return colors?.DarkThemeColor;
    }
    return colors?.ThemeColor;
  };

  return (
    <div className="rounded-md border-2 dark:border-[#221b2e] dark:bg-[#0D071A]">
      <div className="flex items-center justify-between p-2 text-lg">
        <div>{currentLanguage.dashboard_courseTable_CourseStatus_Title}</div>
        <div className="flex gap-2">
        <Link
          onMouseEnter={() => setHoveredCourse(-1)}
          onMouseLeave={() => setHoveredCourse(null)}
          href={`/search/favourite-courses`}
          className="border-2 flex items-center justify-center rounded-full px-2 py-1 text-xs transition duration-300 ease-in-out"
          style={{
            borderColor: getButtonColor(),
            backgroundColor: hoveredCourse === -1 ? getButtonColor() : "",
            color: hoveredCourse === -1 ? "#ffffff" : "",
          }}
        >
          {currentLanguage.dashboard_courseTable_viewMyFavourties_button_text}
        </Link>
        <Link
          onMouseEnter={() => setHoveredCourse(-2)}
          onMouseLeave={() => setHoveredCourse(null)}
          href={`/dashboard/course-list`}
          className="border-2 flex items-center justify-center rounded-full px-2 py-1 text-xs transition duration-300 ease-in-out"
          style={{
            borderColor: getButtonColor(),
            backgroundColor: hoveredCourse === -2 ? getButtonColor() : "",
            color: hoveredCourse === -2 ? "#ffffff" : "",
          }}
        >
          {currentLanguage.dashboard_courseTable_viewAllCourses_button_text}
        </Link>
        </div>
      </div>
      <div className="flex items-center justify-between bg-slate-100 p-2 dark:bg-[#150D22]">
        <p className="w-[45%] text-sm">
          {currentLanguage.dashboard_courseTable_courseName}
        </p>
        <p className="w-[10%] text-sm">
          {currentLanguage.dashboard_courseTable_paid}
        </p>
        <p className="w-[15%] text-sm">
          {currentLanguage.dashboard_courseTable_progress}
        </p>
        <p className="w-[10%] text-sm">
          {currentLanguage.dashboard_courseTable_chapter}
        </p>
        <div className="w-[15%]"></div>
      </div>
      {sortedCourses?.slice(0, maxCourses).map((each: any, index) => {
        const totalProgress =
          each?.chapters?.reduce(
            (acc: any, val: any) =>
              acc +
              (val?.userProgress?.length
                ? val?.userProgress[0]?.progress || 0
                : 0),
            0
          ) / each?.chapters?.length;
        return (
          <div
            key={each?.id}
            className="my-1 flex items-center justify-between p-2"
          >
            <div className="items-cetner flex w-[45%] items-center">
              <Image
                alt="img"
                src={each?.imageUrl}
                objectFit="contain"
                width={65}
                height={65}
                className="rounded-sm"
              />
              <div className="ml-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="m-0 line-clamp-1 cursor-pointer text-start text-sm">
                        {each?.title}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-2">
                      <p className="m-0 whitespace-normal text-sm font-semibold">
                        {each?.title}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="m-0 line-clamp-1 text-xs text-gray-500">
                  {each?.category?.name}
                </p>
              </div>
            </div>
            <div className="w-[10%]">
              <p>${each?.price}</p>
            </div>
            <div className="w-[15%] pr-5">
              <Line
                percent={each?.progress!}
                strokeWidth={3}
                strokeColor={getThemeColor()}
              />
            </div>
            <div className="w-[5%]">
              <p>{each?.chapters?.length}</p>
            </div>
            <div className="flex w-[20%] justify-end px-2">
              <Link href={`/courses/${each.id}`}>
                <div
                  onMouseEnter={() => setHoveredCourse(index)}
                  onMouseLeave={() => setHoveredCourse(null)}
                  className="rounded-full border-2 p-1 text-xs text-slate-600 transition duration-300 ease-in-out"
                  style={{
                    borderColor: getButtonColor(),
                    backgroundColor:
                      hoveredCourse === index ? getButtonColor() : "",
                  }}
                >
                  <Eye
                    className="h-5 w-5"
                    style={{
                      color:
                        theme === "dark"
                          ? hoveredCourse === index
                            ? "#ffffff"
                            : "#ffffff"
                          : hoveredCourse === index
                          ? "#ffffff"
                          : "#000000",
                    }}
                  />
                </div>
              </Link>
            </div>
          </div>
        );
      })}
      {sortedCourses?.length === 0 && (
        <div className="flex h-16 items-center justify-center text-sm text-muted-foreground">
          <BookX className="m-1" size={24} />
          <span>{currentLanguage?.no_courses}</span>
        </div>
      )}
    </div>
  );
};

export default CourseTable;
