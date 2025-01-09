"use client";

import * as z from "zod";
import axios from "axios";
import { PlusCircle, File, Loader2, X, Pencil } from 'lucide-react';
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Chapter } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/check-language";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AttachmentFormProps {
  initialData: Chapter & { attachments: Attachment[] };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
  chapterId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const currentLanguage = useLanguage();
  const toggleEdit = () => {
    setIsEditing((current) => !current);
    setEditingId(null);
    setName("");
    setUrl("");
  };

  const router = useRouter();

  const onSubmit = async () => {
    try {
      const values = { name, url };
      const result = formSchema.safeParse(values);
      
      if (!result.success) {
        throw new Error(result.error.message);
      }
      
      if (editingId) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/attachments/${editingId}`,
          values
        );
        toast.success("Attachment updated");
      } else {
        await axios.post(
          `/api/courses/${courseId}/chapters/${chapterId}/attachments`,
          values
        );
        toast.success("Attachment created");
      }
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/attachments/${id}`
      );
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const onEdit = (attachment: Attachment) => {
    setEditingId(attachment.id);
    setName(attachment.name);
    setUrl(attachment.url);
    setIsEditing(true);
  };

  return (
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <div>{currentLanguage.course_attachmentForm_title}</div>
          {!isEditing && (
            <Button
              onClick={toggleEdit}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          )}
          {isEditing && (
            <Button
              onClick={toggleEdit}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing && (
          <>
            {initialData.attachments.length === 0 ? (
              <p className="text-sm italic text-slate-500">
                {currentLanguage.course_attachmentForm_noAttachments}
              </p>
            ) : (
              <div className="space-y-2">
                {initialData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                  >
                    <File className="mr-2 h-4 w-4 flex-shrink-0" />
                    <p className="line-clamp-1 text-xs">{attachment.name}</p>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => onEdit(attachment)}
                        className="transition hover:opacity-75"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {deletingId === attachment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <button
                          onClick={() => onDelete(attachment.id)}
                          className="transition hover:opacity-75"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {isEditing && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{currentLanguage.course_attachmentForm_name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={currentLanguage.course_attachmentForm_namePlaceholder}
              />
            </div>
            <div>
              <Label htmlFor="file">{currentLanguage.course_attachmentForm_file}</Label>
              {!editingId && (
                <FileUpload
                  endpoint="chapterAttachment"
                  onChange={(uploadedUrl) => {
                    if (uploadedUrl) {
                      setUrl(uploadedUrl);
                    }
                  }}
                />
              )}
              {editingId && (
                <div className="flex items-center gap-2">
                  <Input value={url} disabled />
                  <Button
                    type="button"
                    onClick={() => {
                      setUrl("");
                      setEditingId(null);
                    }}
                    size="sm"
                  >
                    {currentLanguage.course_attachmentForm_changeFile}
                  </Button>
                </div>
              )}
            </div>
            <Button onClick={onSubmit} disabled={!name || (!url && !editingId)}>
              {currentLanguage.course_attachmentForm_submit}
            </Button>
            <div className="text-xs text-muted-foreground">
              {currentLanguage.course_attachmentForm_recommendation}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};