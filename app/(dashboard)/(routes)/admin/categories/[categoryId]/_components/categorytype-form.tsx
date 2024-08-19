"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/lib/check-language";

interface CategoryTypeFormProps {
  initialData: Category;
  categoryId: string;
};

const formSchema = z.object({
  isCourseCategory: z.boolean().default(false),
  isNewsCategory: z.boolean().default(false),
  isLiveEventCategory: z.boolean().default(false),
});

export const CategoryTypeForm = ({
  initialData,
  categoryId,
}: CategoryTypeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        isCourseCategory: !!initialData.isCourseCategory,
        isNewsCategory: !!initialData.isNewsCategory,
        isLiveEventCategory: !!initialData.isLiveEventCategory,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/category/${categoryId}`, values);
      toast.success("Category updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-200 dark:bg-slate-700 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {currentLanguage.post_CategoryTypeForm_title}
      </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2"
          >
            <FormField
              control={form.control}
              name="isCourseCategory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      {currentLanguage.post_CategoryTypeForm_isCourseCategory}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isNewsCategory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      {currentLanguage.post_CategoryTypeForm_isNewsCategory}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isLiveEventCategory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      {currentLanguage.post_CategoryTypeForm_isLiveEventCategory}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                {currentLanguage.post_CategoryTypeForm_save}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  )
}