"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, X, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LiveEvent } from "@prisma/client";

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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UsergroupFormProps {
  initialData: LiveEvent;
  liveEventId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  usergroupId: z.string().min(1),
});

export const UsergroupForm = ({
  initialData,
  liveEventId,
  options,
}: UsergroupFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

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
      await axios.patch(`/api/liveEvent/${liveEventId}`, values);
      toast.success("Event updated");
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
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl justify-between">
          <span className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            {currentLanguage.liveEvent_UsergroupForm_title}
          </span>
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing && (
          <p
            className={cn(
              "text-md font-medium",
              !initialData.usergroupId && "italic text-muted-foreground"
            )}
          >
            {selectedOption?.label ||
              `${currentLanguage.liveEvent_UsergroupForm_allUsers}`}
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
            {currentLanguage.liveEvent_UsergroupForm_cancel}
          </Button>
          <Button
            disabled={!isValid || isSubmitting}
            onClick={() => onSubmit(form.getValues())}
          >
            {currentLanguage.liveEvent_UsergroupForm_save}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
