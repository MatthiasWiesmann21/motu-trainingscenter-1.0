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
import { signIn } from "next-auth/react";

const passwordStrengthSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain a number" });

const formSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: passwordStrengthSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const NewPasswordForm = ({ initialData }: { initialData: Profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        toast.error("New Passwords do not match");
        return;
      }

      const response = await signIn("credentials", {
        email: initialData?.email,
        password: values.oldPassword,
        redirect: false,
      });

      if (response?.error) {
        toast.error("Invalid Old Password");
        return;
      }

      // Attempt to update the password
      const res: any = await axios.patch(`/api/profile/${initialData?.id}`, {
        password: values.newPassword,
      });

      toast.success("Password updated");
      toggleEdit();
      router.refresh();
    } catch (error: any) {
      // Check for specific error messages from the server
      const errorMessage = error.response?.data?.message;
      if (error.response?.status === 400 && errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="mt-4 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex items-center justify-between font-medium">
        {currentLanguage.profile_newPasswordForm_title}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>{currentLanguage.profile_newPasswordForm_cancel}</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              {currentLanguage.profile_newPasswordForm_edit}
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">••••••••</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        currentLanguage.profile_oldPassword_placeholder
                      }
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        currentLanguage.profile_newPasswordForm_placeholder
                      }
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        currentLanguage.profile_confirmPasswordForm_placeholder
                      }
                      disabled={isSubmitting}
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
                onClick={() => onSubmit(form.getValues())}
              >
                {currentLanguage.profile_newPasswordForm_save}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
