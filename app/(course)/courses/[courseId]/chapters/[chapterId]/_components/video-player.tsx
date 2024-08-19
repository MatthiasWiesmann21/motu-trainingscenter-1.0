"use client";
import { Lock } from "lucide-react";
import UniversalPlayer from "@/pages/components/universalPlayer";
import { useEffect, useState } from "react";

interface Progress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface VideoPlayerProps {
  playbackId?: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string | undefined;
  videoUrl: string;
  params: {
    courseId: string;
    chapterId: string;
  };
}

export const VideoPlayer = ({
  isLocked,
  videoUrl,
  params,
}: VideoPlayerProps) => {
  if (!videoUrl) {
    console.error("Vimeo URL is not provided!");
    return null;
  }

  const [chapterProgress, setChapterProgress] = useState<Progress | null>(null);

  const getChapterProgress = async () => {
    const response = await fetch(
      `/api/progress/${params.courseId}/${params.chapterId}`
    );
    const data = await response?.json();
    setChapterProgress(data);
  };

  useEffect(() => {
    getChapterProgress();
  }, []);

  return (
    <div className="relative aspect-video">
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <UniversalPlayer
          url={videoUrl}
          onProgress={async (state: any) => {
            const played = state.played;
            const playedPercent = played * 100;
            if (
              playedPercent?.toString()?.split(".")[0] >
              (chapterProgress?.progress?.toString()?.split(".")[0] || 0)
            ) {
              try {
                const response = await fetch(
                  `/api/progress/${params.courseId}/${params.chapterId}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      isCompleted: playedPercent > 85 ? true : false,
                      progress: playedPercent > 85 ? 100 : playedPercent,
                    }),
                  }
                );
                if (!response.ok) {
                  throw new Error("Failed to update progress");
                }
                const data = await response.json();
                setChapterProgress(data);
              } catch (error) {
                console.error("Error updating progress:", error);
              }
            }
          }}
        />
      )}
    </div>
  );
};
