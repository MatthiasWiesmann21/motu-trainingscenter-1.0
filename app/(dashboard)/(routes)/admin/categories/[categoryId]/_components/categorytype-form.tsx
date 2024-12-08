"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Category } from "@prisma/client"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/lib/check-language"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryTypeFormProps {
  initialData: Category
  categoryId: string
}

const formSchema = z.object({
  isCourseCategory: z.boolean().default(true),
  isNewsCategory: z.boolean().default(true),
  isLiveEventCategory: z.boolean().default(true),
})

export const CategoryTypeForm = ({
  initialData,
  categoryId,
}: CategoryTypeFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const currentLanguage = useLanguage()
  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isCourseCategory: !!initialData.isCourseCategory,
      isNewsCategory: !!initialData.isNewsCategory,
      isLiveEventCategory: !!initialData.isLiveEventCategory,
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/category/${categoryId}`, values)
      toast.success("Category updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{currentLanguage.post_CategoryTypeForm_title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="isCourseCategory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {currentLanguage.post_CategoryTypeForm_isCourseCategory}
                    </FormLabel>
                    <FormDescription>
                      {currentLanguage.post_CategoryTypeForm_isCourseCategory_Description}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isNewsCategory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {currentLanguage.post_CategoryTypeForm_isNewsCategory}
                    </FormLabel>
                    <FormDescription>
                      {currentLanguage.post_CategoryTypeForm_isNewsCategory_Description}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isLiveEventCategory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {currentLanguage.post_CategoryTypeForm_isLiveEventCategory}
                    </FormLabel>
                    <FormDescription>
                      {currentLanguage.post_CategoryTypeForm_isLiveEventCategory_Description}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          className="ml-auto"
          disabled={!isValid || isSubmitting}
          type="submit"
          onClick={() => onSubmit(form.getValues())}
        >
          {currentLanguage.post_CategoryTypeForm_save}
        </Button>
      </CardFooter>
    </Card>
  )
}

