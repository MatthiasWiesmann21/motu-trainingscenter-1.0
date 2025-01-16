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

interface LinkedCourseProps {
  courseId: string;
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

export const LinkedCourse = ({ courseId }: LinkedCourseProps) => {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    return <div className="h-24 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (!course) {
    return null;
  }

  return (
    <Card className="m-4 p-4">
      <div className="flex gap-6">
        {course.imageUrl && (
          <div className="relative h-[150px] w-[200px] flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col flex-1 justify-between">
          <div className="space-y-2">
            {course.category && (
              <Tooltip>
                <TooltipTrigger>
                  <span
                    style={{ borderColor: course.category.colorCode }}
                    className="line-clamp-1 rounded-lg border-2 px-2 py-1 mr-1 text-start text-xs"
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
            <div className="flex flex-col gap-y-1 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-x-2">
                <BookOpen className="h-4 w-4" />
                <span>
                  {course.chaptersCount} {course.chaptersCount === 1 ? "Chapter" : "Chapters"}
                </span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
              )}
              {course.level && (
                <div className="flex items-center gap-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{course.level}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Link href={`/courses/${course.id}`}>
              <Button variant="outline" className="gap-2">
                View Course
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};