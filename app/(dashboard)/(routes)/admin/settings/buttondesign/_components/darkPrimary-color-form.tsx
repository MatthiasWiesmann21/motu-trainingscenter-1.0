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
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useLanguage } from "@/lib/check-language";

interface DarkPrimaryButtonColorFormProps {
  initialData: {
    DarkPrimaryButtonColor: string;
  };
  containerId: string;
}

const formSchema = z.object({
  DarkPrimaryButtonColor: z.string().min(1, {
    message: "Color is required",
  }),
});

export const DarkPrimaryButtonColorForm = ({ initialData, containerId }: DarkPrimaryButtonColorFormProps) => {
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
    <div className="mt-6 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex items-center justify-between font-medium">
        {currentLanguage.customize_DarkPrimaryButtonColorForm_title}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>{currentLanguage.customize_PrimaryButtonColorForm_cancel}</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              {currentLanguage.customize_PrimaryButtonColorForm_edit}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          style={{ backgroundColor: initialData.DarkPrimaryButtonColor }}
          className="mt-2 h-8 w-8 rounded-md"
        >
          <p className="mt-3 p-1 pl-10 text-sm">{initialData.DarkPrimaryButtonColor}</p>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="DarkPrimaryButtonColor"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="color"
                      disabled={isSubmitting}
                      {...field}
                      className="h-10 w-10 rounded-md border-none"
                      style={{
                        backgroundColor: field.value,
                        border: "none",
                        color: field.value,
                      }}
                    />
                  </FormControl>
                  <FormLabel className="p-1">
                    {field.value || initialData.DarkPrimaryButtonColor}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit" onClick={()=>onSubmit(form.getValues())}>
                {currentLanguage.customize_PrimaryButtonColorForm_save}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
