"use client";
import React, { useEffect, useState } from "react";
// @ts-ignore
import CanvasJSReact from "@canvasjs/react-charts";
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
import { set } from "date-fns";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
  useEffect(() => {
    courses?.map((each: any) =>
      each?.chapters?.map((each2: any) =>
        console.log("each", each2?.id, each2?.userProgress[0])
      )
    );
  }, [courses]);

  const progressArray = courses?.map(
    (each: any) =>
      each?.chapters?.reduce(
        (acc: any, val: any) => acc + (val?.userProgress[0]?.progress || 0),
        0
      ) / each?.chapters?.length
  );

  const inProgress = Math.round(
    (progressArray.filter((val: number) => val > 0 && val < 100)?.length /
      progressArray?.length) *
      100
  );
  const notStarted = Math.round(
    (progressArray.filter((val: number) => val === 0)?.length /
      progressArray?.length) *
      100
  );
  const completed = Math.round(
    (progressArray.filter((val: number) => val === 100)?.length /
      progressArray?.length) *
      100
  );

  const getCourseStatusPercentage = (status: string) => {
    const filteredCourses = coursesProgress.filter(
      (course: { status: string }) => course.status === status
    );
    return (
      Math.round((filteredCourses.length / coursesProgress.length) * 100) || 0
    );
  };

  const doughnutOptions = {
    animationEnabled: true,
    backgroundColor: "transparent",
    data: [
      {
        type: "doughnut",
        innerRadius: "80%",
        dataPoints: [
          {
            name: `${currentLanguage.dashboard_doughnut_completed}`,
            y: completed,
            color: "#12b76a",
          },
          {
            name: `${currentLanguage.dashboard_doughnut_inprogress}`,
            y: inProgress,
            color: "#f79009",
          },
          {
            name: `${currentLanguage.dashboard_doughnut_notStarted}`,
            y: notStarted,
            color: "#84caff",
          },
        ],
      },
    ],
  };

  const maxCourses = 5;

  const sortedChapters = courses.flatMap((course: any) =>
    course.chapters.map((chapter: any) => {
      return {
        ...course,
        ...chapter,
        courseName: course?.title,
        totalCount:
          (chapter.likes.length || 0) + (chapter.comments.length || 0),
      };
    })
  );

  return (
    <TooltipProvider>
      <div className="graphParent flex justify-between">
        <div className="min-w-xs mr-2 w-full rounded border-2 dark:border-[#221b2e] dark:bg-[#0D071A]">
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
          <div className="flex items-center justify-between bg-slate-200 p-2 dark:bg-[#150D22]">
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
        <div className="doughnutParent flex w-[30%] min-w-[360px] max-w-full flex-col justify-around rounded border-2 px-4 dark:border-[#221b2e] dark:bg-[#0D071A]">
          <p className="mt-3 text-lg">
            {currentLanguage.dashboard_doughnutChart_title}
          </p>
          <CanvasJSChart options={doughnutOptions} />
          <div className="flex flex-wrap justify-between">
            {[
              {
                label: "Complete",
                color: "#12b76a",
                value: completed,
              },
              {
                label: "Inprogress",
                color: "#f79009",
                value: inProgress,
              },
              {
                label: "Not Started",
                color: "#84caff",
                value: notStarted,
              },
            ].map(({ label, color, value }) => (
              <div key={label} className="flex items-start">
                <div
                  className="mr-1 mt-1 rounded-full border-[6px]"
                  style={{ borderColor: color }}
                />
                <div>
                  <p className="text-md m-0 text-gray-500">{label}</p>
                  <p className="text-md m-0 font-extrabold">{value}%</p>
                </div>
                <div className="border-1 mx-2 my-[2%] border-r border-gray-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PolygonChart;
