"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Palette, Pencil, X } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DarkTextColorFormProps {
  initialData: {
    colorCode: string;
    textColorCode: string;
    darkTextColorCode: string;
  };
  categoryId: string;
}

const formSchema = z.object({
  darkTextColorCode: z.string().min(1, {
    message: "Color is required",
  }),
});

export const DarkTextColorForm = ({
  initialData,
  categoryId,
}: DarkTextColorFormProps) => {
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
      // Preserve existing colors when updating the dark text color
      const updateData = {
        colorCode: initialData.colorCode,
        textColorCode: initialData.textColorCode,
        darkTextColorCode: values.darkTextColorCode,
      };
      await axios.patch(`/api/category/${categoryId}`, updateData);
      toast.success("Category updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex space-x-2">
            <Palette className="h-6 w-6" />
            <span>{currentLanguage.categories_DarkTextColorForm_title}</span>
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
          <div className="flex items-center space-x-4">
            <div
              className="h-10 w-10 rounded-md border border-gray-500"
              style={{ backgroundColor: initialData.darkTextColorCode }}
            />
            <p className="text-md font-medium">{initialData.darkTextColorCode}</p>
          </div>
        )}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="darkTextColorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {currentLanguage.categories_DarkTextColorForm_ColorLabel}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <input
                          type="color"
                          disabled={isSubmitting}
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-12 w-12 cursor-pointer rounded-md border-2"
                        />
                        <Input
                          type="text"
                          disabled={isSubmitting}
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="flex-grow"
                          placeholder="#000000"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {
                        currentLanguage.categories_DarkTextColorForm_ColorFormDescription
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  onClick={() => onSubmit(form.getValues())}
                >
                  {currentLanguage.categories_DarkTextColorForm_save}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};