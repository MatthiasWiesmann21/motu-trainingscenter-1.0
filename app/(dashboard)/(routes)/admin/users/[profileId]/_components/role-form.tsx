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
import { useLanguage } from "@/lib/check-language";

interface RoleFormProps {
  initialData: Profile;
  profileId: string;
  options: { label: string; value: string }[];
}

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
      role: initialData?.role || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.role === "CLIENT ADMIN") {
        toast.error("CLIENT ADMIN role cannot be assigned to a user");
        return;
      } else {
        await axios.patch(`/api/profile/${profileId}`, values);
        toast.success("Profile updated");
        toggleEdit();
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.role
  );

  return (
    <div className="mt-6 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex items-center justify-between font-medium">
        {currentLanguage.user_RoleForm_title}
        {canAccess && (
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
              <>{currentLanguage.user_RoleForm_cancel}</>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                {currentLanguage.user_RoleForm_edit}
              </>
            )}
          </Button>
        )}
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.role && "italic text-slate-500"
          )}
        >
          {selectedOption?.label || "No category"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={...options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                onClick={() => onSubmit(form.getValues())}
              >
                {currentLanguage.user_RoleForm_save}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
