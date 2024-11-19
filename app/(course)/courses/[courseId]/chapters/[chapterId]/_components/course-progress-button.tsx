"use client";

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useLanguage } from "@/lib/check-language";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string | undefined;
  getData: any;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
  getData,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const currentLanguage = useLanguage();

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(`/api/progress/${courseId}/${chapterId}`, {
        isCompleted: !isCompleted,
        progress: isCompleted ? 0 : 100,
      });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      getData();
      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="md:w-32 lg:w-48"
    >
      {isCompleted ? currentLanguage.course_progressButton_NotComplete : currentLanguage.course_progressButton_MarkComplete}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
};
