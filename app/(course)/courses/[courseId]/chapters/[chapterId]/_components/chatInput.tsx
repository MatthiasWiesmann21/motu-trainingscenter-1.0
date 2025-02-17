"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";
import { useState } from "react";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  className?: string;
  placeHolder?: string;
  updateLikeComment?: any;
  getPosts?: any;
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInputPost = ({
  apiUrl,
  query,
  className,
  placeHolder,
  updateLikeComment,
}: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const [isSending, setSending] = useState(false);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSending) return;
    setSending(true);
    try {
      const response = await axios.post(apiUrl, {
        ...query,
        text: values?.content,
      });
      form.reset();
      router.refresh();
      updateLikeComment(response?.data?.post);
      setSending(false);
    } catch (error) {
      console.log(error);
      setSending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // style={{ border: "2px solid coral" }}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={`relative flex items-center py-4 ${className}`}>
                  <Input
                    disabled={isLoading}
                    className="flex w-full rounded-lg border-none border-input bg-slate-100 px-2 py-2 pr-10 text-sm text-zinc-600 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={placeHolder}
                    {...field}
                  />
                  <div className="absolute right-2 mt-1">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field?.onChange(`${field?.value}${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
