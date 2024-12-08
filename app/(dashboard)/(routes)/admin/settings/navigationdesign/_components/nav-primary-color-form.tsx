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
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useLanguage } from "@/lib/check-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PrimaryNavColorFormProps {
  initialData: {
    navPrimaryColor: string;
  };
  containerId: string;
}

const formSchema = z.object({
  navPrimaryColor: z.string().min(1, {
    message: "Color is required",
  }),
});

export const PrimaryNavColorForm = ({ initialData, containerId }: PrimaryNavColorFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/containers/${containerId}`,
        values
      );
      dispatch({ type: "UpdateUserContainer", payload: response?.data });
      toast.success("Container updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="my-4 w-full">
    <CardHeader>
      <CardTitle className="flex items-center justify-between space-x-2">
        <div className="flex text-xl space-x-2">
          <Palette className="h-6 w-6" />
          <span>{currentLanguage.customize_navPrimaryColorForm_title}</span>
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
        <div className="w-10 h-10 rounded-md border border-gray-500" style={{backgroundColor: initialData.navPrimaryColor}}/>
        <p className="text-md font-medium">{initialData.navPrimaryColor}</p>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="navPrimaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{currentLanguage.customize_navPrimaryColorForm_ColorLabel}</FormLabel>
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
                    {currentLanguage.categories_ColorForm_ColorFormDescription}
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
