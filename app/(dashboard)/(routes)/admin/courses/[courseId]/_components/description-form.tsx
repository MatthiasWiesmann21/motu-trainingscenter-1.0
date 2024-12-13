"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FileText, Pencil, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/check-language";
import { CoursePreview } from "@/components/course-preview";
import { Editor } from "@/components/editor";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export const DescriptionForm = ({
  initialData,
  courseId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
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
      <div className="flex items-center">
      <FileText className="mr-2 h-5 w-5" />
        {currentLanguage.courses_descriptionForm_title}
        <span className="pl-2 text-xs text-rose-600">
          {currentLanguage.requiredFields}
        </span>
        </div>
        <div>
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
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {!isEditing && (
        <div
          className={cn(
            "text-sm",
            !initialData.description && "italic text-muted-foreground"
          )}
        >
          {!initialData.description && "No description"}
          {initialData.description && (
            <CoursePreview value={initialData.description} />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </CardContent>
    {isEditing && (
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={toggleEdit} disabled={isSubmitting}>
          {currentLanguage.commonButton_cancel}
        </Button>
        <Button
          disabled={!isValid || isSubmitting}
          onClick={() => onSubmit(form.getValues())}
        >
          {currentLanguage.commonButton_save}
        </Button>
      </CardFooter>
    )}
  </Card>
  );
};
