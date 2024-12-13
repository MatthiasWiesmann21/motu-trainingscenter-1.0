"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/check-language";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ComboboxNumber } from "@/components/ui/combobox-number";

interface CategoryFormProps {
  initialData: {
    maxCourses: number;
  };
  containerId: string;
  options: { label: string; value: number; }[];
};

const formSchema = z.object({
  maxCourses: z.number().int().min(1),
});

export const MaxCoursesForm = ({
  initialData,
  containerId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          maxCourses: initialData?.maxCourses || undefined
      },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/containers/${containerId}`, values);
      toast.success("Container updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const selectedOption = options.find((option) => option.value === initialData.maxCourses);

  return (
    <Card className="my-4 w-full">
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-xl">
        <span>Container Max Courses</span>
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
            !initialData.maxCourses && "italic text-muted-foreground"
          )}
        >
          {selectedOption?.label || "no Package"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="maxCourses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{currentLanguage.user_RoleForm_Label}</FormLabel>
                  <FormControl>
                    <ComboboxNumber options={options} {...field} />
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