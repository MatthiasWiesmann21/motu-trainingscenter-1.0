"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Pencil, X, Clock } from 'lucide-react'
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Chapter } from "@prisma/client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/check-language"
import { formatDuration } from "@/lib/formatDuration"
import { cn } from "@/lib/utils"

interface DurationFormProps {
  initialData: Chapter
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  hours: z.number().min(0).max(999),
  minutes: z.number().min(0).max(59),
})

export const DurationForm = ({
  initialData,
  courseId,
  chapterId,
}: DurationFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const currentLanguage = useLanguage()
  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const initialHours = Math.floor(Number(initialData?.duration || 0) / 60)
  const initialMinutes = Number(initialData?.duration || 0) % 60

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hours: initialHours,
      minutes: initialMinutes,
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const duration = values.hours * 60 + values.minutes
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { duration: duration.toString() })
      toast.success("Chapter updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            {currentLanguage.chapters_durationForm_title}
            <span className="ml-2 text-xs text-rose-600">
              {currentLanguage.requiredFields}
            </span>
          </div>
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
              !initialData.duration && "italic text-slate-500"
            )}
          >
            {formatDuration(initialData.duration)}
          </p>
        )}
        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{currentLanguage.chapters_durationForm_hoursLabel}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min={0}
                          max={999}
                          placeholder={currentLanguage.chapters_durationForm_hoursPlaceholder}
                          className="text-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minutes"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{currentLanguage.chapters_durationForm_minutesLabel}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min={0}
                          max={59}
                          placeholder={currentLanguage.chapters_durationForm_minutesPlaceholder}
                          className="text-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleEdit}
                  disabled={isSubmitting}
                >
                  {currentLanguage.commonButton_cancel}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!isValid || isSubmitting}
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  {currentLanguage.commonButton_save}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}