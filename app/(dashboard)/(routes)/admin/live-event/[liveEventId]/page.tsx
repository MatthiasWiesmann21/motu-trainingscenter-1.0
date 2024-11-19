import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, ListChecks, User } from "lucide-react";

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
import authOptions from "@/lib/auth"; // Ensure this is configured correctly
import GoBackButton from "@/components/goBackButton";
import { IsStreamChatForm } from "./_components/isStreamChat-form";
import { UsergroupForm } from "./_components/usergroup-form";

const LiveEventIdPage = async ({
  params,
}: {
  params: { liveEventId: string };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const currentLanguage = await languageServer();

  if (!userId) {
    return redirect("/");
  }

  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  if (container?.clientPackage === "STARTER") {
    return redirect("/admin/live-event");
  }

  const liveEvent = await db.liveEvent.findUnique({
    where: {
      id: params.liveEventId,
      containerId: session?.user?.profile?.containerId,
    },
  });

  const categories = await db.category.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
      isLiveEventCategory: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const usergroups = await db.usergroup.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
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
    liveEvent.startDateTime,
    liveEvent.endDateTime,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!liveEvent.isPublished && (
        <Banner label={currentLanguage.liveEvent_unpublish_banner} />
      )}
      <div className="p-6">
        <GoBackButton buttonText={currentLanguage.goBack_button_text} />
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
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              initialData={liveEvent}
              liveEventId={liveEvent.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <UsergroupForm
              initialData={liveEvent}
              liveEventId={liveEvent.id}
              options={usergroups.map((usergroup) => ({
                label: usergroup.name,
                value: usergroup.id,
              }))}
            />
            <StartDateTimeForm
              initialData={liveEvent}
              liveEventId={liveEvent.id}
            />
            <EndDateTimeForm
              initialData={liveEvent}
              liveEventId={liveEvent.id}
            />
            <IsStreamChatForm
              initialData={liveEvent}
              liveEventId={liveEvent.id}
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
