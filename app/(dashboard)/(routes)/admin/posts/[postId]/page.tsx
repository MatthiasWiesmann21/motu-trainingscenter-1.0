import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ArrowLeft, Image, LayoutGridIcon, User } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { Actions } from "./_components/actions";
import { languageServer } from "@/lib/check-language-server";
import Link from "next/link";
import { ScheduleDateForm } from "./_components/schedule-date-form";
import authOptions from "@/lib/auth"; // Ensure this is configured correctly
import GoBackButton from "@/components/goBackButton";
import { UsergroupForm } from "./_components/usergroup-form";

const PostIdPage = async ({
  params
}: {
  params: { postId: string }
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const currentLanguage = await languageServer();

  if (!userId) {
    return redirect("/");
  }

  const post = await db.post.findUnique({
    where: {
      id: params.postId,
      containerId: session?.user?.profile?.containerId,
    }
  });

  const categories = await db.category.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
      isNewsCategory: true,
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

  const profile = await db.profile.findFirst({
    where: {
      userId: userId,
      containerId: session?.user?.profile?.containerId,
    },
  });

  if (!post) {
    return redirect("/");
  }

  const requiredFields = [
    post.title,
    post.description,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!post.isPublished && (
        <Banner
          label={currentLanguage.post_unpublish_banner}
        />
      )}
      <div className="p-6">
        <GoBackButton buttonText={currentLanguage.goBack_button_text} />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              {currentLanguage.post_setup_title}
            </h1>
            <span className="text-sm text-slate-700 dark:text-[#ffffff]">
              {currentLanguage.post_setup_undertitle} {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            postId={params.postId}
            isPublished={post.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutGridIcon} />
              <h2 className="text-xl">
                {currentLanguage.post_setup_customize_title}
              </h2>
              <span className="pl-1 text-xs text-rose-600">{currentLanguage.requiredFields}</span>
            </div>
            <TitleForm
              initialData={post}
              postId={post.id}
            />
            <DescriptionForm
              initialData={post}
              postId={post.id}
            />
            <div className="flex items-center gap-x-2 mt-5">
              <IconBadge icon={LayoutGridIcon} />
              <h2 className="text-xl">
                {currentLanguage.post_setup_category_title}
              </h2>
            </div>
            <CategoryForm
              initialData={post}
              postId={post.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <UsergroupForm
              initialData={post}
              postId={post.id}
              options={usergroups.map((usergroup) => ({
                label: usergroup.name,
                value: usergroup.id,
              }))}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Image} />
              <h2 className="text-xl">
                {currentLanguage.post_setup_image_title}
              </h2>
            </div>
            <ImageForm
              initialData={post}
              postId={post.id}
            />
            <ScheduleDateForm
              initialData={{
                ...post,
                scheduleDateTime: post.scheduleDateTime ?? new Date()
              }}
              postId={post.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostIdPage;
