"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Profile } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useLanguage } from "@/lib/check-language";
import { UserAvatar } from "@/components/user-avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ImageFormProps {
  initialData: Profile;
  profileId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, profileId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentLanguage = useLanguage();
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/profile/${profileId}`, values);
      toast.success("Profile Picture updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{currentLanguage.profile_ImageForm_title}</span>
          <Button
            onClick={toggleEdit}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {isEditing ? (
              <X className="h-4 w-4" />
            ) : !initialData.imageUrl ? (
              <PlusCircle className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing &&
          (!initialData.imageUrl ? (
            <div className="flex h-60 items-center justify-center rounded-md bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex items-center justify-center ">
              <div className="relative h-64 w-64">
                <Image
                  alt="Profile Icon"
                  fill
                  className="rounded-full object-cover"
                  src={initialData.imageUrl}
                />
              </div>
            </div>
          ))}
        {isEditing && (
          <div className="h-full">
            <FileUpload
              endpoint="ProfileImage"
              onChange={(url) => {
                if (url) {
                  onSubmit({ imageUrl: url });
                }
              }}
            />
            <p className="text-sm text-muted-foreground">
              {currentLanguage.profile_ImageForm_help}
            </p>
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={toggleEdit}>
            {currentLanguage.commonButton_cancel}
          </Button>
          <Button
            onClick={() => onSubmit({ imageUrl: initialData.imageUrl || "" })}
            disabled={!initialData.imageUrl}
          >
            {currentLanguage.commonButton_save}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};