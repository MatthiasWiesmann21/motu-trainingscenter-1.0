"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Pencil, X, Lock } from 'lucide-react'
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/check-language"
import { Profile } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const passwordStrengthSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain a number" })

const formSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: passwordStrengthSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const NewPasswordForm = ({ initialData }: { initialData: Profile }) => {
  const [isEditing, setIsEditing] = useState(false)
  const currentLanguage = useLanguage()
  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        toast.error("New Passwords do not match")
        return
      }

      const response = await signIn("credentials", {
        email: initialData?.email,
        password: values.oldPassword,
        redirect: false,
      })

      if (response?.error) {
        toast.error("Invalid Old Password")
        return
      }

      const res: any = await axios.patch(`/api/profile/${initialData?.id}`, {
        password: values.newPassword,
      })

      toast.success("Password updated")
      toggleEdit()
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message
      if (error.response?.status === 400 && errorMessage) {
        toast.error(errorMessage)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex text-xl items-center justify-between">
          <span className="flex items-center">
            <Lock className="mr-2 h-5 w-5" />
            {currentLanguage.profile_newPasswordForm_title}
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
          <p className="text-xl font-medium text-start">••••••••••••••••</p>
        )}
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{currentLanguage.profile_oldPassword_placeholder}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{currentLanguage.profile_newPasswordForm_placeholder}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{currentLanguage.profile_confirmPasswordForm_placeholder}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isSubmitting}
                        {...field}
                      />
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
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={toggleEdit}
          >
            {currentLanguage.profile_newPasswordForm_cancel}
          </Button>
          <Button
            disabled={!isValid || isSubmitting}
            onClick={() => onSubmit(form.getValues())}
          >
            {currentLanguage.profile_newPasswordForm_save}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

