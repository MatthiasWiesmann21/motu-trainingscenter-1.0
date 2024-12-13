"use client"

import * as z from "zod"
import axios from "axios"
import { Pencil, PlusCircle, Upload, Video, X } from 'lucide-react'
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { LiveEvent } from "@prisma/client"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import UniversalPlayer from "@/pages/components/universalPlayer"
import { UploadButton } from "@/utils/uploadthing"
import AppSVGIcon from "@/components/appsvgicon"
import { useLanguage } from "@/lib/check-language"

interface VideoFormProps {
  initialData: LiveEvent
  liveEventId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
})

const options = [
  {
    value: "https://vimeo.com/",
    label: "Vimeo",
    icon: "vimeo",
  },
  {
    value: "https://www.youtube.com/",
    label: "YouTube",
    icon: "youtube",
  },
  {
    value: "https://utfs.io/",
    label: "Upload",
    icon: "uploadthing-logo",
  },
]

export const VideoForm = ({ initialData, liveEventId }: VideoFormProps) => {
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [videoType, setVideoType] = useState<any>({})
  const [videoUrl, setVideoUrl] = useState("")
  const currentLanguage = useLanguage()

  useEffect(() => {
    if (initialData?.videoUrl) {
      const video = initialData?.videoUrl
        ?.split("/")
        ?.filter((each, index) => index > 2)
        ?.join("/")
      const videoProvider = `${initialData?.videoUrl
        ?.split("/")
        ?.filter((each, index) => index < 3)
        ?.join("/")}/`
      const provider = options?.find((each) => each?.value === videoProvider)
      setVideoUrl(video)
      setVideoType(provider)
    }
  }, [initialData])

  const VimeoPreview = ({ videoId }: { videoId: string }) => (
    <div className="h-[300px]">
      <UniversalPlayer url={videoId} />
    </div>
  )

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/liveEvent/${liveEventId}`, values)
      toast.success("Event updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  // Check if video preview is valid
  const isPreviewAvailable = videoType && videoUrl && (videoType.value !== "https://utfs.io/" || videoUrl.trim() !== "")

  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle className="flex items-center text-xl justify-between">
          <span className="flex items-center">
            <Video className="mr-2 h-5 w-5" />
            {currentLanguage.liveEvent_videoForm_title}
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
        {!isEditing && (videoType && videoUrl ? (
          <VimeoPreview videoId={`${videoUrl}`} />
        ) : (
          <div className="flex h-60 items-center justify-center rounded-md bg-muted">
            <Video className="h-10 w-10 text-muted-foreground" />
          </div>
        ))}
        {isEditing && (
          <div className="space-y-4">
            <Select
              value={videoType?.value}
              onValueChange={(value) => {
                const selectedOption = options.find(opt => opt.value === value)
                setVideoType(selectedOption)
                if (selectedOption?.value !== "https://utfs.io/") {
                  setVideoUrl("") // Clear videoUrl for non-upload options
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select video source" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <AppSVGIcon customclass="mr-2 w-[32px]" icon={option.icon} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {videoType?.value === "https://utfs.io/" && (
              <div className="flex justify-center">
                <UploadButton
                  endpoint="videoUploader"
                  onClientUploadComplete={(res: any) => {
                    setVideoUrl(res[0]?.url)
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload error: ${error.message}`)
                  }}
                />
              </div>
            )}
            {videoType?.value !== "https://utfs.io/" && (
              <Input
                type="text"
                placeholder="Share Link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            )}
            {videoType && videoUrl && (
              <VimeoPreview videoId={`${videoUrl}`} />
            )}
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end">
          <Button
            disabled={!isPreviewAvailable}
            onClick={() => onSubmit({ videoUrl: videoType?.value + videoUrl })}
          >
            {currentLanguage.liveEvent_videoForm_save}
          </Button>
        </CardFooter>
      )}
      {initialData?.videoUrl && !isEditing && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {currentLanguage.liveEvent_videoForm_preview}
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
