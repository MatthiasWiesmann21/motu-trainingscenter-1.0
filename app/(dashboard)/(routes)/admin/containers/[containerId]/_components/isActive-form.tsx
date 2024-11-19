"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Container } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface activeFormProps {
  initialData: Container | any;
  containerId: string;
}

const formSchema = z.object({
  active: z.boolean().default(true),
});

export const ActiveForm = ({ initialData, containerId }: activeFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: !!initialData.active,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/containers/${containerId}`, values);
      toast.success("Active Status updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-md border border-red-600 bg-slate-200 p-4 dark:border-red-600 dark:bg-slate-700">
      <div className="flex items-center justify-between font-medium">
        Active
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
          <FormField
            control={form.control}
            name="active"
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
                    It is the active status of the container
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
          Save
        </Button>
      </div>
    </div>
  );
};
