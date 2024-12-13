"use client"

import axios from "axios"
import { Trash2, AlertTriangle } from 'lucide-react'
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useIsAdmin } from "@/lib/roleCheck"
import { useLanguage } from "@/lib/check-language"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DeleteProfileFormProps {
  profileId: string
}

export const DeleteProfileForm = ({
  profileId,
}: DeleteProfileFormProps) => {
  const isAdmin = useIsAdmin()
  const currentLanguage = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/profile/${profileId}`)
      toast.success("Profile deleted")
      router.push(`/auth/sign-in`)
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full my-4 border-red-600">
      <CardHeader>
        <CardTitle className="flex items-center text-xl space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>{currentLanguage.user_DeleteProfileForm_title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{currentLanguage.user_DeleteProfileForm_AlerTitle}</AlertTitle>
          <AlertDescription>
            {currentLanguage.user_DeleteProfileForm_AlerDescription}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-end">
        <ConfirmModal 
          dialogActionClass="bg-red-600 mt-2" 
          onConfirm={onDelete}
        >
          <Button size="sm" variant="destructive" disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            {currentLanguage.user_DeleteProfileForm_ConfirmModalDeleteProfile}
          </Button>
        </ConfirmModal>
      </CardFooter>
    </Card>
  )
}

