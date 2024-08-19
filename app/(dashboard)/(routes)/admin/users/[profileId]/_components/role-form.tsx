"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, Profile } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { useIsAdmin } from "@/lib/roleCheck";
import { isOwner } from "@/lib/owner";
import { auth } from "@clerk/nextjs";
import { useLanguage } from "@/lib/check-language";

interface RoleFormProps {
  initialData: Profile;
  profileId: string;
  options: { label: string; value: string; }[];
};

const formSchema = z.object({
  role: z.string().min(1),
});

export const RoleForm = ({
  initialData,
  profileId,
  options,
}: RoleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const isAdmin = useIsAdmin();
  const currentLanguage = useLanguage();
  const canAccess = isAdmin || process.env.NEXT_PUBLIC_OWNER_ID;

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: initialData?.role || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/profile/${profileId}`, values);
      toast.success("Profile updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const selectedOption = options.find((option) => option.value === initialData.role);

  return (
    <div className="mt-6 border bg-slate-200 dark:bg-slate-700 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {currentLanguage.user_RoleForm_title}
        {canAccess && (
          <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>{currentLanguage.user_RoleForm_cancel}</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {currentLanguage.user_RoleForm_edit}
            </>
          )}
        </Button>
        )}
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.role && "text-slate-500 italic"
        )}>
          {selectedOption?.label || "No category"}
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={...options}
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
                {currentLanguage.user_RoleForm_save}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}