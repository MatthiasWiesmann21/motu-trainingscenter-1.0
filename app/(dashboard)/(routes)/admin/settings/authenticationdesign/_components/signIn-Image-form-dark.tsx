"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Container } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useLanguage } from "@/lib/check-language";

interface ImageFormProps {
  initialData: Container;
  containerId: string;
}

const formSchema = z.object({
  darkSignInImageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const DarkSignInImageForm = ({ initialData, containerId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/containers/${containerId}`, values);
      toast.success("Container updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex items-center justify-between font-medium">
        {currentLanguage.customize_darkSignInImageForm_title}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>{currentLanguage.customize_darkSignInImageForm_cancel}</>}
          {!isEditing && !initialData.darkSignInImageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              {currentLanguage.customize_darkSignInImageForm_addImage}
            </>
          )}
          {!isEditing && initialData.darkSignInImageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              {currentLanguage.customize_darkSignInImageForm_edit}
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.darkSignInImageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              priority
              className="rounded-md object-cover"
              src={initialData.darkSignInImageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="darkSignInImage" 
            onChange={(url) => {
              if (url) {
                onSubmit({ darkSignInImageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            {currentLanguage.customize_darkSignInImageForm_imageHint}
          </div>
        </div>
      )}
    </div>
  );
};
