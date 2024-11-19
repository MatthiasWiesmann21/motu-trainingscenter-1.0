"use client";
import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import Image from "next/image";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import vimeo from "@/assets/icons/Vimeo-Logo.png";
import youtube from "@/assets/icons/Youtube-Logo.png";
import utfs from "@/assets/icons/uploadthing-logo.svg";
import UniversalPlayer from "@/pages/components/universalPlayer";
import { useTheme } from "next-themes";
import { UploadButton } from "@/utils/uploadthing";
import AppSVGIcon from "@/components/appsvgicon";

interface ChapterVideoFormProps {
  initialData: Chapter;
  chapterId: string;
  courseId: string;
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

export const ChapterVideoForm = ({ initialData, chapterId, courseId }: ChapterVideoFormProps) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [videoType, setVideoType] = useState<any>({});
  const [videoUrl, setVideoUrl] = useState("");

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
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-200 p-4 dark:bg-slate-700">
      <div className="flex mb-2 items-center justify-between font-medium">
        Chapters Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : initialData.videoUrl ? (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a video
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
      {/* {console.log("videoType", videoType, "videoUrl", videoUrl)} */}

      {isEditing && (
        <>
          <div
            className="flex items-center justify-around"
            // style={{ border: "10px solid red" }}
          >
            <UploadButton
              endpoint="chapterVideo"
              onClientUploadComplete={(res: any) => {
                // Do something with the response
                setVideoType(options[3]);
                setVideoUrl(
                  res[0]?.url
                );
                // console.log(
                //   "Files: ",
                //   res[0]?.url
                //     ?.split("/")
                //     ?.filter((each: any, index: any) => index < 3)
                //     ?.join("/")
                // );
                // console.log(
                //   "Files: ",
                //   res[0]?.url
                //     ?.split("/")
                //     ?.filter((each: any, index: any) => index > 2)
                //     ?.join("/")
                // );
                // alert(`Upload Completed ${res[0]?.url}`);
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
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
                Save
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
          Refresh the page if video does not appear.
        </div>
      )}
    </div>
  );
};
