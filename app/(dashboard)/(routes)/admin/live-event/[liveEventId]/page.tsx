import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { EventDescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { Actions } from "./_components/actions";
import { VideoForm } from "./_components/event-video-form";
import { StartDateTimeForm } from "./_components/startDateTime-form";
import { EndDateTimeForm } from "./_components/endDateTime-form";
import { languageServer } from "@/lib/check-language-server";
import Link from "next/link";

const LiveEventIdPage = async ({
  params,
}: {
  params: { liveEventId: string };
}) => {
  const { userId } = auth();
  const currentLanguage = await languageServer();
  if (!userId) {
    return redirect("/");
  }

  const liveEvent = await db.liveEvent.findUnique({
    where: {
      id: params.liveEventId,
      containerId: process.env.CONTAINER_ID,
    },
  });

  const categories = await db.category.findMany({
    where: {
      containerId: process.env.CONTAINER_ID,
      isLiveEventCategory: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!liveEvent) {
    return redirect("/");
  }

  const requiredFields = [
    liveEvent.title,
    liveEvent.description,
    liveEvent.imageUrl,
    liveEvent.categoryId,
    liveEvent.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  console.log("liveEvent", liveEvent);

  return (
    <>
      {!liveEvent.isPublished && (
        <Banner label={currentLanguage.liveEvent_unpublish_banner} />
      )}
      <div className="p-6">
      <Link
        href={`/admin/live-event`}
        className="mb-6 flex items-center text-sm transition hover:opacity-75"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {currentLanguage.liveEvent_setup_backToEventAdminList_button_text}
      </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">{currentLanguage.liveEvent_setup_title}</h1>
            <span className="text-sm text-slate-700 dark:text-[#ffffff]">
              {currentLanguage.liveEvent_setup_undertitle} {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            liveEventId={params.liveEventId}
            isPublished={liveEvent.isPublished}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">{currentLanguage.liveEvent_setup_customize_title}</h2>
              <span className="pl-1 text-xs text-rose-600">{currentLanguage.requiredFields}</span>
            </div>
            <TitleForm initialData={liveEvent} liveEventId={liveEvent.id} />
            <EventDescriptionForm
              initialData={liveEvent}
              liveEventId={liveEvent.id}
            />
            <CategoryForm
              initialData={{
                ...liveEvent,
              }}
              liveEventId={liveEvent.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <StartDateTimeForm
              //@ts-ignore
              initialData={liveEvent}
              liveEventId={liveEvent?.id}
            />
            <EndDateTimeForm
              //@ts-ignore
              initialData={liveEvent}
              liveEventId={liveEvent?.id}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  {currentLanguage.liveEvent_setup_video_title}
                  <span className="pl-1 text-xs text-rose-600">{currentLanguage.requiredFields}</span>
                </h2>
              </div>
              <ImageForm initialData={liveEvent} liveEventId={liveEvent.id} />
              <VideoForm initialData={liveEvent} liveEventId={liveEvent.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveEventIdPage;
