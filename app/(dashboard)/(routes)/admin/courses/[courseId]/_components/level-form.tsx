"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GraduationCap, Pencil, X } from "lucide-react";
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
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/lib/check-language";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface LevelFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string; }[];
};

const formSchema = z.object({
  level: z.string().min(1),
});

export const LevelForm = ({
  initialData,
  courseId,
  options,
}: LevelFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: initialData?.level || ""
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
  }

  const selectedOption = options.find((option) => option.value === initialData.level);

  return (
    <Card className="my-4 w-full">
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-xl">
        <div className="flex items-center">
          {currentLanguage.courses_levelForm_title}         
        </div>
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
            !initialData.level && "italic text-muted-foreground"
          )}
        >
          {selectedOption?.label || `${currentLanguage.courses_levelForm_noLevel}`}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
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
  )
}