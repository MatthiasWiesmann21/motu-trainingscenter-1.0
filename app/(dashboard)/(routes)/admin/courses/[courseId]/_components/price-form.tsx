"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { useLanguage } from "@/lib/check-language";
import { cn } from "@/lib/utils";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formattedValues = {
        ...values,
        price: Number(values.price), // Ensure price is a number
      };
      await axios.patch(`/api/courses/${courseId}`, formattedValues); // Send the formatted values
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
          <div>
            {currentLanguage.course_priceForm_title}
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
              !initialData.price && "italic text-slate-500"
            )}
          >
            {initialData.price
              ? formatPrice(initialData.price)
              : currentLanguage.courses_priceForm_noPrice}
          </p>
        )}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        disabled={isSubmitting}
                        placeholder={
                          currentLanguage.courses_priceForm_placeholder
                        }
                        {...field}
                        className="text-md"
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
                  {currentLanguage.commonButton_cancel}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!isValid || isSubmitting}
                  onClick={() => onSubmit(form.getValues())}
                >
                  {currentLanguage.commonButton_save}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
