"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@prisma/client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/check-language";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/tooltip";
import { Eye } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { cn } from "@/lib/utils";

const PolygonChart = ({
  colors,
  courses,
}: {
  colors: Container | any;
  courses: any;
}) => {
  const currentLanguage = useLanguage();
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const { theme } = useTheme();

  const getButtonColor = () => {
    if (theme === "dark") {
      return colors?.DarkPrimaryButtonColor!;
    }
    return colors?.PrimaryButtonColor!;
  };

  const fetchCoursesProgress = async () => {
    try {
      const response = await fetch("/api/userhascourse");
      const data = await response.json();
      setCoursesProgress(data);
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  };

  useEffect(() => {
    fetchCoursesProgress();
  }, []);

  const progressArray = courses?.map((course: any) => {
    // Only consider courses that have been purchased
    if (!course.purchases?.length) return null;
    
    // Calculate progress for each chapter
    const chapterProgresses = course.chapters.map((chapter: any) => {
      const progress = chapter.userProgress?.[0]?.isCompleted ? 100 : (chapter.userProgress?.[0]?.progress || 0);
      return progress;
    });
    
    // Course is completed if all chapters are completed
    const isAllCompleted = chapterProgresses.every((progress: number) => progress === 100);
    if (isAllCompleted) return 100;
    
    // Calculate average progress if not completed
    const totalProgress = chapterProgresses.reduce((acc: number, val: number) => acc + val, 0);
    return Math.round(totalProgress / course.chapters.length);
    // @ts-ignore
  }).filter(progress => progress !== null);

  const inProgress = Math.round(
    (progressArray.filter((val: number) => val > 0 && val < 100)?.length /
      progressArray?.length) *
      100
  ) || 0;

  const notStarted = Math.round(
    (progressArray.filter((val: number) => val === 0)?.length /
      progressArray?.length) *
      100
  ) || 0;

  const completed = Math.round(
    (progressArray.filter((val: number) => val === 100)?.length /
      progressArray?.length) *
      100
  ) || 0;

  const chartData = [
    {
      name: currentLanguage.dashboard_doughnut_completed,
      value: completed,
      color: "#12b76a"
    },
    {
      name: currentLanguage.dashboard_doughnut_inprogress,
      value: inProgress,
      color: "#f79009"
    },
    {
      name: currentLanguage.dashboard_doughnut_notStarted,
      value: notStarted,
      color: "#84caff"
    }
  ];

  const maxCourses = 5;

  const sortedChapters = courses.flatMap((course: any) =>
    course.chapters.map((chapter: any) => {
      return {
        ...course,
        ...chapter,
        courseName: course?.title,
        totalCount: (chapter.likes.length || 0) + (chapter.comments.length || 0),
      };
    })
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={cn(
          "rounded-lg p-2 shadow-lg",
          theme === "dark" ? "bg-slate-800" : "bg-white"
        )}>
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <TooltipProvider>
      <div className="graphParent flex flex-col lg:flex-row gap-4">
        <div className="min-w-xs w-full rounded border-2 dark:border-[#221b2e] dark:bg-[#0D071A]">
          <div className="flex items-center justify-between p-2 text-lg">
            <div>{currentLanguage.dashboard_popularChapter_title}</div>
            <Link
              onMouseEnter={() => setHovered(1)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center justify-center rounded-full border-2 px-2 py-1 text-xs transition duration-300 ease-in-out"
              style={{
                borderColor: getButtonColor(),
                backgroundColor: hovered === 1 ? getButtonColor() : "",
                color: hovered === 1 ? "#ffffff" : "",
              }}
              href={`/dashboard/favourite-chapters`}
            >
              {
                currentLanguage.dashboard_courseTable_viewFavoriteChapters_button_text
              }
            </Link>
          </div>
          <div className="flex items-center justify-between bg-slate-100 p-2 dark:bg-[#150D22]">
            <p className="w-[40%] text-xs">
              {currentLanguage.dashboard_popularChapter_chapterName_text}
            </p>
            <p className="w-[35%] text-xs">
              {currentLanguage.dashboard_popularChapter_courseName_text}
            </p>
            <p className="w-[10%] text-xs">
              {currentLanguage.dashboard_popularChapter_likes_text}
            </p>
            <p className="w-[10%] text-xs">
              {currentLanguage.dashboard_popularChapter_action_text}
            </p>
          </div>
          {sortedChapters
            ?.sort(
              (a: any, b: any) => (b.totalCount || 0) - (a.totalCount || 0)
            )
            ?.slice(0, maxCourses)
            ?.map((each: any, index: React.SetStateAction<number | null>) => (
              <div
                key={each?.id}
                className="my-1 flex items-center justify-between p-2"
              >
                <Tooltip>
                  <TooltipTrigger className="flex w-[40%] items-center">
                    <Image
                      alt="img"
                      src={each?.imageUrl}
                      width={64}
                      height={36}
                      className="rounded-sm"
                    />
                    <div className="ml-2">
                      <p className="m-0 line-clamp-1 text-start">
                        {each?.title}
                      </p>
                      <p className="m-0 line-clamp-1 text-start text-xs text-gray-500">
                        {each?.category?.name}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibolb h-full max-w-[300px] whitespace-normal">
                      {each?.title}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="w-[35%] text-start">
                    <p className="line-clamp-2">{each?.courseName}</p>
                    <p className="line-clamp-1 text-xs text-gray-500">
                      {each?.category?.name}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="h-full max-w-[300px] whitespace-normal font-semibold">
                      {each?.courseName}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <div className="w-[10%]">
                  <p>{each?.likes?.length}</p>
                </div>
                <div className="flex w-[10%]">
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        href={`/courses/${each?.courseId}/chapters/${each?.id}`}
                      >
                        <div
                          onMouseEnter={() => setHoveredCourse(index)}
                          onMouseLeave={() => setHoveredCourse(null)}
                          className="rounded-full border-2 p-1 text-xs transition duration-300 ease-in-out"
                          style={{
                            borderColor: getButtonColor(),
                            backgroundColor:
                              hoveredCourse === index ? getButtonColor() : "",
                          }}
                        >
                          <Eye
                            className="h-5 w-5"
                            style={{
                              color: hoveredCourse === index ? "#ffffff" : "",
                            }}
                          />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="h-full max-w-[300px] whitespace-normal font-semibold">
                        {
                          currentLanguage.dashboard_courseTable_viewCourse_button_text
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
        </div>
        <div className="w-full lg:w-[30%] min-w-[300px] rounded border-2 dark:border-[#221b2e] dark:bg-[#0D071A] p-4">
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg">{currentLanguage.dashboard_doughnutChart_title}</div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer className="w-full h-full">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value: string) => (
                      <span className={cn(
                        "text-md font-medium",
                        theme === "dark" ? "text-slate-200" : "text-slate-900"
                      )}>
                        {value}
                      </span>
                    )}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PolygonChart;