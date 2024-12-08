"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, PlusCircle } from 'lucide-react'
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Chapter, Course } from "@prisma/client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChaptersList } from "./chapters-list"
import { useLanguage } from "@/lib/check-language"

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] }
  courseId: string
}

const formSchema = z.object({
  title: z.string().min(1),
})

export const ChaptersForm = ({
  initialData,
  courseId
}: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const currentLanguage = useLanguage()
  const toggleCreating = () => setIsCreating((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success("Chapter created")
      toggleCreating()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      })
      toast.success("Chapters reordered")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/admin/courses/${courseId}/chapters/${id}`)
  }

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="flex text-lg items-center justify-between">
          {currentLanguage.courses_chaptersForm_title}
          <Button onClick={toggleCreating} variant="ghost">
            {isCreating ? (
              currentLanguage.courses_chaptersForm_cancel
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                {currentLanguage.courses_chaptersForm_addChapter}
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCreating && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder={currentLanguage.courses_chaptersForm_placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                {currentLanguage.courses_chaptersForm_save}
              </Button>
            </form>
          </Form>
        )}
        {!isCreating && (
          <div className="relative">
            {isUpdating && (
              <div className="absolute inset-0 bg-slate-500/20 flex items-center justify-center rounded-md">
                <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
              </div>
            )}
            {!initialData.chapters.length ? (
              <p className="text-sm text-muted-foreground italic">
                {currentLanguage.courses_chaptersForm_noChapters}
              </p>
            ) : (
              <ChaptersList
                onEdit={onEdit}
                onReorder={onReorder}
                items={initialData.chapters || []}
              />
            )}
          </div>
        )}
      </CardContent>
      {!isCreating && initialData.chapters.length > 0 && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            {currentLanguage.courses_chaptersForm_reorderInstructions}
          </p>
        </CardFooter>
      )}
    </Card>
  )
}

