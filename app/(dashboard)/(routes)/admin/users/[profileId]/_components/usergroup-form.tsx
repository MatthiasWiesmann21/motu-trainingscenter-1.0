"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
import { use, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Profile } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/lib/check-language";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsAdmin } from "@/lib/roleCheck";

interface UsergroupFormProps {
  initialData: Profile;
  profileId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  usergroupId: z.string().min(1),
});

export const UsergroupForm = ({
  initialData,
  profileId,
  options,
}: UsergroupFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);
  const isAdmin = useIsAdmin()
  const canAccess = isAdmin || process.env.NEXT_PUBLIC_OWNER_ID

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usergroupId: initialData?.usergroupId || "",
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
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.usergroupId
  );

  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{currentLanguage.profile_UsergroupForm_title}</span>
          {canAccess && (
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
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing && (
          <p
            className={cn(
              "text-md font-medium",
              !initialData.role && "italic text-muted-foreground"
            )}
          >
            {selectedOption?.label ||
              `${currentLanguage.post_UsergroupForm_noUsergroup}`}
          </p>
        )}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="usergroupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{currentLanguage.user_UsergroupForm_Label}</FormLabel>
                    <FormControl>
                      <Combobox options={options} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={toggleEdit} disabled={isSubmitting}>
            {currentLanguage.commonButton_cancel}
          </Button>
          <Button
            disabled={!isValid || isSubmitting}
            onClick={() => onSubmit(form.getValues())}
          >
            {currentLanguage.commonButton_save}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
