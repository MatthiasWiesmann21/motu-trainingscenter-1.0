"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useLanguage } from "@/lib/check-language";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const CreateUserGroupModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const currentLanguage = useLanguage();

  const isModalOpen = isOpen && type === "createUsergroup";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/usergroup", values);
      router.push(`/admin/usergroups/${response.data.id}`);
      toast.success("Usergroup created");
      onClose();
    } catch {
      toast.error(
        "Something went wrong"
      );
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="overflow-hidden p-0">
        <AlertDialogHeader className="px-6 pt-8">
          <AlertDialogTitle className="text-center text-2xl font-bold">
            {currentLanguage.createUsergroup_title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {currentLanguage.createUsergroup_description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        {currentLanguage.createUsergroup_form_label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder={
                            currentLanguage.createUsergroup_form_placeholder
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="dark:text-[#ffffff]">
                        {currentLanguage.createUsergroup_form_description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <AlertDialogFooter className="px-6 py-4">
              <AlertDialogCancel>
                {currentLanguage.createUsergroup_cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={!isValid || isSubmitting} onClick={() => onSubmit(form.getValues())}>
                {currentLanguage.createUsergroup_submit}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
