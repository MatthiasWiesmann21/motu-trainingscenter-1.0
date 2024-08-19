"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Post } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useLanguage } from "@/lib/check-language";

interface ImageFormProps {
  initialData: Post;
  postId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, postId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/posts/${postId}`, values);
      toast.success("Post updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex items-center justify-between font-medium">
        {currentLanguage.post_ImageForm_title}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>{currentLanguage.post_ImageForm_cancel}</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              {currentLanguage.post_ImageForm_add}
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              {currentLanguage.post_ImageForm_edit}
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              priority
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="PostImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            {currentLanguage.post_ImageForm_help}
          </div>
        </div>
      )}
    </div>
  );
};
