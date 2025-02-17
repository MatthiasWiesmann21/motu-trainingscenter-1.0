"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useLanguage } from "@/lib/check-language"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ExternalLink } from 'lucide-react'
import toast from "react-hot-toast"

interface PrivacyPolicyModalProps {
  profile: { id: string; acceptedPrivacyPolicy: boolean } | null
}

export default function PrivacyPolicyModal({
  profile,
}: PrivacyPolicyModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLanguage = useLanguage()

  useEffect(() => {
    if (profile?.acceptedPrivacyPolicy === false) {
      setIsOpen(true)
    }
  }, [profile])

  const acceptPrivacyPolicy = async () => {
    try {
      const response = await axios.patch(`/api/profile/${profile?.id}`, {
        acceptedPrivacyPolicy: true,
      })

      if (response.status === 200) {
        toast.success("Privacy policy accepted")
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Error accepting privacy policy:", error)
      toast.error("Something went wrong")
    }
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-2xl md:max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{currentLanguage.privacy_policy_title}</AlertDialogTitle>
          <AlertDialogDescription>
            {currentLanguage.privacy_policy_description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Button variant="outline" className="w-full" asChild>
              <a
                href="https://clubyte.live/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                {currentLanguage.privacy_policy_link}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a
                href="https://clubyte.live/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                {currentLanguage.privacy_termsOfService_link}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <AlertDialogFooter>
          <Button onClick={acceptPrivacyPolicy} className="w-full">
            {currentLanguage.privacy_policy_button}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}