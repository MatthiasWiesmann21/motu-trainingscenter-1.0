"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon, Pencil, X } from 'lucide-react'
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/check-language"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { LiveEvent } from "@prisma/client"

interface DateFormProps {
  initialData: LiveEvent;
  liveEventId: string
}

const formSchema = z.object({
  endDateTime: z.date(),
})

export const EndDateTimeForm = ({
  initialData,
  liveEventId,
}: DateFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    initialData.endDateTime ? new Date(initialData.endDateTime) : undefined
  )
  const currentLanguage = useLanguage()
  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endDateTime: initialData.endDateTime ? new Date(initialData.endDateTime) : undefined,
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/liveEvent/${liveEventId}`, {
        ...values,
        isEnded: false,
      })
      toast.success("Event updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle className="flex items-center text-xl justify-between">
          <span className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            {currentLanguage.liveEvent_endDateTimeForm_title}
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
              !date && "italic text-muted-foreground"
            )}
          >
            {date
              ? format(date, "PPP p")
              : "No Date Selected"}
          </p>
        )}
        {isEditing && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP p") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
              <div className="p-3 border-t">
                <Input
                  type="time"
                  value={date ? format(date, "HH:mm") : ""}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':')
                    const newDate = date ? new Date(date) : new Date()
                    newDate.setHours(parseInt(hours), parseInt(minutes))
                    setDate(newDate)
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            onClick={toggleEdit}
            disabled={isSubmitting}
          >
            {currentLanguage.commonButton_cancel}
          </Button>
          <Button
            disabled={!date || isSubmitting}
            onClick={() => onSubmit({ endDateTime: date! })}
          >
            {currentLanguage.commonButton_save}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}