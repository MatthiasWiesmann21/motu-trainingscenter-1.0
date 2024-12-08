"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Container } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useLanguage } from "@/lib/check-language";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ImageFormProps {
  initialData: Container;
  containerId: string;
}

const formSchema = z.object({
  darkForgetPasswordImageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const DarkForgetPasswordImageForm = ({ initialData, containerId }: ImageFormProps) => {
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
    <Card className="w-full my-4">
    <CardHeader>
      <CardTitle className="flex items-center text-xl justify-between">
        <span>{currentLanguage.customize_darkForgePasswordImageForm_title}</span>
        <Button
          onClick={toggleEdit}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          {isEditing ? (
            <X className="h-4 w-4" />
          ) : !initialData.darkForgetPasswordImageUrl ? (
            <PlusCircle className="h-4 w-4" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {!isEditing && (
        !initialData.darkForgetPasswordImageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-muted">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        ) : (
          <div className="relative aspect-video">
            <Image
              alt="Container Icon"
              fill
              className="rounded-md object-cover"
              src={initialData.darkForgetPasswordImageUrl}
            />
          </div>
        )
      )}
      {isEditing && (
        <div className="space-y-4">
          <FileUpload
            endpoint="darkForgetPasswordImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ darkForgetPasswordImageUrl: url })
              }
            }}
          />
          <p className="text-sm text-muted-foreground">
            {currentLanguage.customize_darkForgePasswordImageForm_imageHint}
          </p>
        </div>
      )}
    </CardContent>
    {isEditing && (
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={toggleEdit}
        >
          {currentLanguage.commonButton_cancel}
        </Button>
        <Button
          onClick={() => onSubmit({ darkForgetPasswordImageUrl: initialData.darkForgetPasswordImageUrl || "" })}
          disabled={!initialData.darkForgetPasswordImageUrl}
        >
          {currentLanguage.commonButton_save}
        </Button>
      </CardFooter>
    )}
  </Card>
  );
};
