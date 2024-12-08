"use client"

import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { Grip, Pencil } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/check-language"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"

interface ChaptersListProps {
  items: Chapter[]
  onReorder: (updateData: { id: string; position: number }[]) => void
  onEdit: (id: string) => void
}

export const ChaptersList = ({
  items,
  onReorder,
  onEdit,
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [chapters, setChapters] = useState(items)
  const currentLanguage = useLanguage()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setChapters(items)
  }, [items])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1)

    setChapters(items)

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }))

    onReorder(bulkUpdateData)
  }

  if (!isMounted) {
    return null
  }

  return (
    <TooltipProvider>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {chapters.map((chapter, index) => (
                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                  {(provided) => (
                    <Card
                      className={cn(
                        "mb-4",
                        chapter.isPublished && "bg-sky-100 dark:bg-sky-900"
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center gap-x-2">
                          <div
                            className={cn(
                              "px-2 py-3 rounded-sm border-r transition hover:bg-slate-200 dark:hover:bg-slate-800",
                              chapter.isPublished && "hover:bg-sky-200 dark:hover:bg-sky-800"
                            )}
                            {...provided.dragHandleProps}
                          >
                            <Grip className="h-5 w-5" />
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex-grow truncate py-3">{chapter.title}</div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-[300px] break-words">{chapter.title}</p>
                            </TooltipContent>
                          </Tooltip>
                          <div className="ml-auto flex items-center gap-x-2 px-2">
                            {chapter.isFree && (
                              <Badge variant="secondary">
                                {currentLanguage.courses_setup_free_badge}
                              </Badge>
                            )}
                            <Badge
                              variant={chapter.isPublished ? "default" : "secondary"}
                            >
                              {chapter.isPublished
                                ? currentLanguage.courses_setup_published_text
                                : currentLanguage.courses_setup_draft_text}
                            </Badge>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Pencil
                                  onClick={() => onEdit(chapter.id)}
                                  className="h-4 w-4 cursor-pointer transition hover:opacity-75"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                {currentLanguage.courses_setup_edit_chapter}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </TooltipProvider>
  )
}

