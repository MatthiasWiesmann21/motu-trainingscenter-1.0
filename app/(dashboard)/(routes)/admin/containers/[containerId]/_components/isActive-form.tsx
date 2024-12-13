"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Container } from "@prisma/client"
import { AlertTriangle } from 'lucide-react'

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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ActiveFormProps {
  initialData: Container
  containerId: string
}

const formSchema = z.object({
  active: z.boolean().default(true),
})

export const ActiveForm = ({ initialData, containerId }: ActiveFormProps) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: !!initialData.active,
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/containers/${containerId}`, values)
      toast.success("Active Status updated")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <Card className="w-full my-4 border-red-600">
      <CardHeader>
        <CardTitle className="flex text-xl items-center space-x-2">
          <span>Active Status</span>
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Changing the active status may affect the visibility and functionality of this container. Data will still be saved, but there were no access to the container.
          </AlertDescription>
        </Alert>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Toggle the active status of the container
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
          className="w-full"
          disabled={!isValid || isSubmitting}
          onClick={() => onSubmit(form.getValues())}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}

