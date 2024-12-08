"use client"

import { Clipboard, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ContainerIdProps {
  initialData: {
    id: string
  }
}

export const ShowContainerId = ({ initialData }: ContainerIdProps) => {
  const [isBlurred, setIsBlurred] = useState(true)

  const handleToggleBlur = () => {
    setIsBlurred(!isBlurred)
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(initialData.id)
      toast.success("ID copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy ID", error)
      toast.error("Failed to copy ID")
    }
  }

  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle className='text-xl'>Container ID</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-muted p-4 rounded-md overflow-hidden">
          <p
            className={cn(
              "text-md font-mono transition-all duration-300",
              isBlurred && "blur-sm select-none"
            )}
          >
            {initialData.id}
          </p>
          {isBlurred && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <p className="text-sm text-muted-foreground">Hidden for security</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleBlur}
          title={isBlurred ? "Show ID" : "Hide ID"}
        >
          {isBlurred ? (
            <EyeIcon className="h-4 w-4" />
          ) : (
            <EyeOffIcon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyId}
          title="Copy ID to clipboard"
        >
          <Clipboard className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

