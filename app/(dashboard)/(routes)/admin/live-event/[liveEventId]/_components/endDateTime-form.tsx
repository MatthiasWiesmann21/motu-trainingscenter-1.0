"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar, Pencil, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import { useLanguage } from "@/lib/check-language";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DateFormProps {
  initialData: {
    endDateTime: Date | any;
  };
  liveEventId: string;
}

const formSchema = z.object({
  endDateTime: z
    .string()
    ?.min(1, {
      message: "This is required",
    })
    ?.transform((str) => new Date(str)),
});

export const EndDateTimeForm = ({
  initialData,
  liveEventId,
}: DateFormProps) => {
  const dateInputRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");
  const currentLanguage = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting } = form?.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/liveEvent/${liveEventId}`, {
        ...values,
        isEnded: false,
      });
      toast.success("Event updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            {currentLanguage.liveEvent_endDateTimeForm_title}
          </span>
          <Button
            onClick={toggleEdit}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {isEditing ? (
              <X className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing && (
          <p
            className={cn(
              "text-md font-medium",
              !initialData?.endDateTime && "italic text-muted-foreground"
            )}
          >
            {initialData?.endDateTime
              ? moment(initialData?.endDateTime).format("DD-MM-YY HH:mm")
              : "No Date Selected"}
          </p>
        )}
        {isEditing && (
          <div className="relative space-y-4">
            <input
              type="datetime-local"
              ref={dateInputRef}
              className="sr-only"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Input
              // @ts-ignore
              onClick={() => dateInputRef.current?.showPicker()}
              type="text"
              placeholder="Select Date & Time"
              value={
                selectedDate
                  ? moment(selectedDate).format("YYYY-MM-DD HH:mm")
                  : ""
              }
              readOnly
              className="cursor-pointer"
            />
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={toggleEdit} disabled={isSubmitting}>
            {currentLanguage.commonButton_cancel}
          </Button>
          <Button
            disabled={selectedDate === "" || isSubmitting}
            onClick={() => onSubmit({ endDateTime: new Date(selectedDate) })}
          >
            {currentLanguage.commonButton_save}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
