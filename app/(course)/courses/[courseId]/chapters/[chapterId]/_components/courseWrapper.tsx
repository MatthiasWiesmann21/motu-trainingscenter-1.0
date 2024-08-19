"use client";
import { Banner } from "@/components/banner";
import React, { useEffect, useState } from "react";
import { VideoPlayer } from "./video-player";
import Love from "./heart";
import { CourseProgressButton } from "./course-progress-button";
import { CourseEnrollButton } from "./course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File, FileX } from "lucide-react";
import LikeComment from "./likeComment";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isOwner } from "@/lib/owner";
import { isAdmin, isOperator } from "@/lib/roleCheckServer";

interface Params {
  courseId: string;
  chapterId: string;
}

interface CurrentLanguage {
  course_chapter_author_text: string;
  chapter_CourseDocuments_Title: string;
  chapter_attachments_NoDocuments: string;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface Chapter {
  isFree: boolean;
  title: string;
  videoUrl: string;
  description: string;
  author: string;
  id: string;
}

interface Course {
  price: number;
}

interface UserProgress {
  isCompleted: boolean;
  status: string;
  id: string;
  userId: string;
  courseId: string;
}

interface CourseWrapperProps {
  params: Params;
  currentLanguage: CurrentLanguage;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  author: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  likes: any[]; // specify the type if possible
  currentLike: boolean;
  commentsWithLikes: any[]; // specify the type if possible
  comments: any[]; // specify the type if possible
}

interface Course {
  price: number;
}

interface DataObject {
  chapter: Chapter | null;
  course: Course | null;
  attachments: any[]; // specify the type if possible
  nextChapter: any; // specify the type if possible
  userProgress: any; // specify the type if possible
  purchase: any; // specify the type if possible
}

const CourseWrapper: React.FC<CourseWrapperProps> = ({
  params,
  currentLanguage,
}) => {
  const [courseProgress, setCourseProgress] = useState<UserProgress | null>(
    null
  );
  const [data, setData] = useState<DataObject>({
    chapter: null,
    course: null,
    attachments: [],
    nextChapter: null,
    userProgress: null,
    purchase: null,
  });

  const { chapter, course, attachments, nextChapter, userProgress, purchase } =
    data;
  const isLocked = !chapter?.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  const getData = async () => {
    const response = await fetch(
      `/api/courses/${params.courseId}/chapters/${params.chapterId}`
    );
    const data: DataObject = await response.json();
    // console.log("qwertyuiop", data);
    setData(data);
  };

  useEffect(() => {
    getData();
  }, [params.courseId, params.chapterId]);

  return (
    <TooltipProvider>
      <div className="w-full">
        {isLocked && (
          <Banner
            variant="warning"
            label="You need to purchase this course to watch this chapter."
          />
        )}
        <div className="mx-auto flex flex-col pb-20">
          <div className="p-4">
            <VideoPlayer
              videoUrl={chapter?.videoUrl || ""}
              title={chapter?.title}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
              courseId={params.courseId}
              chapterId={params.chapterId}
              params={params}
            />
          </div>
          <div>
            <div className="flex flex-col items-center justify-between px-4 md:flex-row">
              <Tooltip>
                <TooltipTrigger>
                  <h2 className="mb-2 line-clamp-1 text-start text-xl font-medium">
                    {chapter?.title}
                  </h2>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-2">
                  <h2 className="whitespace-normal font-semibold">
                    {chapter?.title}
                  </h2>
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center space-x-2">
                <Love chapter={chapter} getData={getData} />
                {purchase ? (
                  <CourseProgressButton
                    chapterId={params.chapterId}
                    courseId={params.courseId}
                    nextChapterId={nextChapter?.id}
                    isCompleted={data?.userProgress?.progress === 100}
                    getData={getData}
                  />
                ) : (
                  <CourseEnrollButton
                    courseId={params?.courseId}
                    price={course?.price!}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-between px-4 pb-2 md:flex-row">
              {chapter?.author && (
                <div>
                  <span className="flex items-center text-[14px] text-gray-500">
                    {currentLanguage.course_chapter_author_text}{" "}
                    {chapter?.author}
                  </span>
                </div>
              )}
            </div>
            <Separator />
            <div className="p-4 pt-0">
              <Preview value={chapter?.description!} />
            </div>
            <div className="m-4 mt-0 rounded-lg bg-slate-100/60 pt-4 dark:bg-[#0c0319]">
              <span className="ml-4 text-sm font-bold">
                {currentLanguage.chapter_CourseDocuments_Title}
              </span>
              <div className="text-gray-500">
                {!!attachments.length && (
                  <>
                    <Separator />
                    <div className="p-4">
                      {attachments.map((attachment: Attachment) => (
                        <a
                          href={attachment.url}
                          target="_blank"
                          key={attachment.id}
                          className="flex w-full items-center rounded-md border bg-sky-200 p-3 text-sky-700 hover:underline"
                        >
                          <File />
                          <p className="line-clamp-1">{attachment.name}</p>
                        </a>
                      ))}
                    </div>
                  </>
                )}
                {!attachments.length && (
                  <div className="flex items-center justify-center gap-2 px-4 py-6">
                    <FileX className="text-slate-400 dark:text-slate-600" />
                    <p>{currentLanguage.chapter_attachments_NoDocuments}</p>
                  </div>
                )}
              </div>
            </div>
            <LikeComment
              id={params.chapterId}
              likesCount={data?.chapter?.likes?.length!}
              currentLike={data?.chapter?.currentLike!}
              commentsWithLikes={data?.chapter?.commentsWithLikes}
              commentsCount={data?.chapter?.comments?.length!}
              updateLikeComment={getData}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CourseWrapper;
