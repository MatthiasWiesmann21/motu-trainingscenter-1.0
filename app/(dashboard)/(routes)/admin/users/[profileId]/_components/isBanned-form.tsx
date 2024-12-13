"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { useIsAdmin } from "@/lib/roleCheck";
import { isOwner } from "@/lib/owner";
import { useLanguage } from "@/lib/check-language";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface isBannedFormProps {
  initialData: Profile;
  profileId: string;
  options: { label: string; value: string; }[];
};

const formSchema = z.object({
  isBanned: z.string().min(1),
});

export const IsBannedForm = ({
  initialData,
  profileId,
  options,
}: isBannedFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const isAdmin = useIsAdmin();
  const currentLanguage = useLanguage();
  const canAccess = isAdmin || process.env.NEXT_PUBLIC_OWNER_ID;
  const { setValue } = useForm();

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isBanned: initialData?.isBanned!
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: any ) => {
    try {
      console.log("Form in on submit function" , form , form.getValues() );
      await axios.patch(`/api/profile/${profileId}`, form.getValues());
      toast.success("Profile updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const selectedOption = options.find((option) => option.value === initialData.isBanned);

  const  comboBoxChanged = (e: any)=> {
    // initialData.isBanned = (e === "BANNED");
    form.setValue("isBanned" , e);
    console.log("Combo box changed" , e );
  }

  return (
    <Card className="w-full my-4 border border-red-600">
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-xl">
        <span>{currentLanguage.user_isBannedForm_title}</span>
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
          {selectedOption?.label}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isBanned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{currentLanguage.user_isBannedForm_Label}</FormLabel>
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
  )
}