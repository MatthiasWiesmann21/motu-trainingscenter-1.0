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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TitleFormProps {
  initialData: {
    name: string;
  };
  categoryId: string;
};

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const TitleForm = ({
  initialData,
  categoryId
}: TitleFormProps) => {
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
    <Card className="w-full my-4">
    <CardHeader>
      <CardTitle className="text-xl flex items-center justify-between">
        <span>{currentLanguage.categories_TitleForm_title}</span>
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
        <p className="text-md font-medium">{initialData.name}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder={currentLanguage.categories_TitleForm_placeholder}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleEdit}
                disabled={isSubmitting}
              >
                {currentLanguage.categories_TitleForm_cancel}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!isValid || isSubmitting}
              >
                {currentLanguage.categories_TitleForm_save}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </CardContent>
  </Card>
  )
}