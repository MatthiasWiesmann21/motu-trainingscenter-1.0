"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Category, LiveEvent } from "@prisma/client";

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
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/check-language";

interface isStreamChatFormProps {
  initialData: LiveEvent;
  liveEventId: string;
}

const formSchema = z.object({
  isStreamChat: z.boolean().default(true),
});

export const IsStreamChatForm = ({
  initialData,
  liveEventId,
}: isStreamChatFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isStreamChat: !!initialData.isStreamChat,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/liveEvent/${liveEventId}`, values);
      toast.success("Event updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex items-center justify-between font-medium">
        {currentLanguage.liveEvent_isStreamChatForm_title}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-2 grid grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="isStreamChat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription>
                    {currentLanguage.liveEvent_isStreamChatForm_isStreamChat}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex items-center gap-x-2">
        <Button
          disabled={!isValid || isSubmitting}
          type="submit"
          onClick={() => onSubmit(form.getValues())}
        >
          {currentLanguage.liveEvent_isStreamChatForm_save}
        </Button>
      </div>
    </div>
  );
};
