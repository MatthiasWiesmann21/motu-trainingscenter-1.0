"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Post } from "@prisma/client";
import { useLanguage } from "@/lib/check-language";

interface DateFormProps {
  initialData: Post & {
    scheduleDateTime?: Date | undefined;
  };
  postId: string;
}

const formSchema = z.object({
  scheduleDateTime: z
    .string()
    ?.min(1, {
      message: "This is required",
    })
    ?.transform((str) => new Date(str)),
});

export const ScheduleDateForm = ({
  initialData,
  postId,
}: DateFormProps) => {
  const dateInputRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form?.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/posts/${postId}`, values);
      if (initialData?.scheduleDateTime > new Date()) {
        await axios.patch(`/api/posts/${postId}/unpublish`);
      }
      toast.success("Post updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  // TODO: Translate this
  return (
    <div className="mt-6 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex items-center justify-between font-medium">
        {currentLanguage.post_scheduleDateForm_title}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>{currentLanguage.post_scheduleDateForm_cancel}</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              {currentLanguage.post_scheduleDateForm_edit}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData?.scheduleDateTime && "italic text-slate-500"
          )}
        >
          {initialData?.scheduleDateTime
            ? moment(initialData?.scheduleDateTime)?.format("DD-MM-YY HH:mm")
            : "No Date Selected"}
        </p>
      )}
      {isEditing && (
        <div className="relative mt-4 space-y-4">
          <input
            type="datetime-local"
            ref={dateInputRef}
            className="absolute -z-[1]"
            onChange={(e) => setSelectedDate(e?.target?.value)}
          />
          <input
            // @ts-ignore
            onClick={() => dateInputRef?.current?.showPicker()}
            type="text"
            placeholder="Select Date & Time"
            value={
              selectedDate
                ? moment(selectedDate)?.format("YYYY-MM-DD HH:mm")
                : ""
            }
            disabled={isSubmitting}
            className="z-[1] flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex items-center gap-x-2">
            <Button
              disabled={selectedDate === "" || isSubmitting}
              onClick={() =>
                onSubmit({ scheduleDateTime: new Date(selectedDate) })
              }
            >
              {currentLanguage.post_scheduleDateForm_save}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
