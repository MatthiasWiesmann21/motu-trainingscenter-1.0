"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";

interface ColorFormProps {
  initialData: {
    colorCode: string;
  };
  categoryId: string;
};

const formSchema = z.object({
  colorCode: z.string().min(1, {
    message: "Color is required",
  }),
});

export const ColorForm = ({
  initialData,
  categoryId
}: ColorFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
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
        {currentLanguage.categories_ColorForm_title}
      </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="colorCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="color"
                      disabled={isSubmitting}
                      {...field}
                      className="w-10 h-11 rounded-md border-none" 
                      style={{ backgroundColor: "#334155" }}
                      />
                  </FormControl>
                  <FormLabel className="m-2">
                    {field.value || initialData.colorCode}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                {currentLanguage.categories_ColorForm_save}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  )
}