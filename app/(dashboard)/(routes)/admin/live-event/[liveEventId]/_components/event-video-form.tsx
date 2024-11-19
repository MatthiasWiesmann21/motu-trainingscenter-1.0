"use client";
import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Upload, Video } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LiveEvent } from "@prisma/client";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import UniversalPlayer from "@/pages/components/universalPlayer";
import { useTheme } from "next-themes";
import { UploadButton } from "@/utils/uploadthing";
import AppSVGIcon from "@/components/appsvgicon";
import { useLanguage } from "@/lib/check-language";

interface VideoFormProps {
  initialData: LiveEvent;
  liveEventId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const options = [
  {
    value: "https://vimeo.com/",
    label: (
      <div className="flex items-center">
        <AppSVGIcon customclass="mr-2 w-[50px]" icon={"vimeo"} />
        <p className="m-0">vimeo</p>
      </div>
    ),
  },
  {
    value: "https://www.youtube.com/",
    label: (
      <div className="flex items-center">
        <AppSVGIcon customclass="mr-2 w-[32px]" icon={"youtube"} />
        <p className="m-0">youtube</p>
      </div>
    ),
  },
  {
    value: "https://utfs.io/",
    label: (
      <div className="flex items-center">
        <AppSVGIcon customclass="mr-2 w-[50px]" icon={"uploadthing-logo"} />
        <p className="m-0">Uploadthing</p>
      </div>
    ),
  },
];

export const VideoForm = ({ initialData, liveEventId }: VideoFormProps) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [videoType, setVideoType] = useState<any>({});
  const [videoUrl, setVideoUrl] = useState("");
  const currentLanguage = useLanguage();

  useEffect(() => {
    if (initialData?.videoUrl) {
      const video = initialData?.videoUrl
        ?.split("/")
        ?.filter((each, index) => index > 2)
        ?.join("/");
      const videoProvider = `${initialData?.videoUrl
        ?.split("/")
        ?.filter((each, index) => index < 3)
        ?.join("/")}/`;
      const provider = options?.find((each) => each?.value === videoProvider);
      setVideoUrl(video);
      setVideoType(provider);
    }
  }, []);

  const VimeoPreview = ({ videoId }: { videoId: string }) => (
    <div className="h-[300px]">
      {/* <EventModal
        liveEventId={liveEventId}
        endDateTime={initialData?.endDateTime}
      /> */}
      <UniversalPlayer url={videoId} />
    </div>
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/liveEvent/${liveEventId}`, values);
      toast.success("Event updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex mb-2 items-center justify-between font-medium">
        {currentLanguage.liveEvent_videoForm_title}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>{currentLanguage.liveEvent_videoForm_cancel}</>
          ) : initialData.videoUrl ? (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              {currentLanguage.liveEvent_videoForm_edit}
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              {currentLanguage.liveEvent_videoForm_add}
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (videoType && videoUrl ? (
          <VimeoPreview videoId={`${videoUrl}`} />
        ) : (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ))}
      {isEditing && (
        <>
          <div className="flex items-center justify-around">
            <UploadButton
              endpoint="videoUploader"
              onClientUploadComplete={(res: any) => {
                setVideoType(options[3]);
                setVideoUrl(
                  res[0]?.url
                );
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
          <div>
            <Select
              options={options}
              onChange={(e: any) => setVideoType(e)}
              value={videoType}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: isDarkTheme
                    ? "focusBackground"
                    : "defaultBackground",
                  color: "red",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: isDarkTheme ? "#fff" : "black",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: isDarkTheme
                    ? "rgb(51 65 85 / var(--tw-bg-opacity))"
                    : "rgb(226 232 240 / var(--tw-bg-opacity))",
                }),
                // @ts-ignore
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state?.isFocused
                    ? isDarkTheme
                      ? "rgb(186 230 253 / 0.1)"
                      : "lightblue"
                    : null,
                  color: isDarkTheme ? "white" : "black",
                  "&:hover": {
                    backgroundColor: isDarkTheme
                      ? "rgb(186 230 253 / 0.1)"
                      : "lightblue",
                  },
                }),
              }}
            />
            <div className="my-1 flex items-center">
              <input
                className="flex w-full items-center rounded-md p-1"
                type="text"
                placeholder="Share Link"
                value={videoUrl}
                onChange={(e: any) => setVideoUrl(e?.target?.value)}
              />
            </div>
            <div className="m-[1%] flex items-center justify-end p-[1%]">
              <Button
                disabled={videoType === "" || videoUrl === ""}
                onClick={() =>
                  onSubmit({ videoUrl: videoType?.value + videoUrl })
                }
              >
                {currentLanguage.liveEvent_videoForm_save}
              </Button>
            </div>
            {videoType && videoUrl && (
              <VimeoPreview videoId={`${videoUrl}`} />
            )}
          </div>
        </>
      )}

      {initialData?.videoUrl && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
          {currentLanguage.liveEvent_videoForm_preview}
        </div>
      )}
    </div>
  );
};
