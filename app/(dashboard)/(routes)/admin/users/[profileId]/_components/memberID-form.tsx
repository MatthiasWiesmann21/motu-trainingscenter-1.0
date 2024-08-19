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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";
import { Profile } from "@prisma/client";

interface MemebrIDFormProps {
  initialData: Profile;
  profileId: string;
};

const formSchema = z.object({
  memberId: z.coerce.number()
});

export const MemberIDForm = ({
  initialData,
  profileId
}: MemebrIDFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {memberId: initialData.memberId}
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/profile/${profileId}`, values);
      toast.success("User MemberID updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-200 dark:bg-slate-700 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {currentLanguage.profile_MemberIdForm_title}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>{currentLanguage.profile_MemberIdForm_cancel}</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {currentLanguage.profile_MemberIdForm_edit}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2 break-words">
          {initialData.memberId}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={currentLanguage.profile_MemberIdForm_placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                {currentLanguage.profile_MemberIdForm_save}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}