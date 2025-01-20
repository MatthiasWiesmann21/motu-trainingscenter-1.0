"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { AlertTriangle, TypeIcon as type, LucideIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/check-language"

interface MenuItemProps {
  icon: LucideIcon
  label: string
  href: string
  isNew?: boolean
  somethingImportant?: boolean
  themeColor: string
  darkThemeColor: string
}

export const MenuItem = ({
  icon: Icon,
  label,
  href,
  isNew,
  somethingImportant,
  themeColor,
  darkThemeColor,
}: MenuItemProps) => {
  const router = useRouter()
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const currentLanguage = useLanguage();

  const getThemeColor = () => {
    return theme === "dark" ? darkThemeColor : themeColor
  }

  return (
    <Card
      className="overflow-hidden border-2 transition-all duration-300 hover:shadow-lg"
      style={{
        borderColor: isHovered ? getThemeColor() : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-center">
          <Icon size={48} className="text-primary transition-transform duration-300 ease-in-out group-hover:scale-110" />
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="text-center text-xl font-semibold">{label}</h2>
      </CardContent>
      <CardFooter className="flex justify-between px-4 pb-4">
        <div className="flex space-x-2 mr-2">
          {isNew && (
            <Badge variant="secondary" className="bg-green-500 text-white">
              New
            </Badge>
          )}
          {somethingImportant && (
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              <AlertTriangle size={14} className="mr-1" />
              Important
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          className="ml-auto transition-colors duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
          onClick={() => router.push(href)}
        >
          {currentLanguage.analytics_widgetButton_view}
        </Button>
      </CardFooter>
    </Card>
  )
}

