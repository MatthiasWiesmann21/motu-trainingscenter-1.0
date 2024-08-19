import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ArrowLeft, Image, LayoutGridIcon } from "lucide-react";

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

const PostIdPage = async ({
  params
}: {
  params: { postId: string }
}) => {
  const { userId } = auth();
  const currentLanguage = await languageServer();
  if (!userId) {
    return redirect("/");
  }

  const post = await db.post.findUnique({
    where: {
      id: params.postId,
      containerId: process.env.CONTAINER_ID,
    }
  });

  const categories = await db.category.findMany({
    where: {
      containerId: process.env.CONTAINER_ID,
      isNewsCategory: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const profile = await db.profile.findUnique({
    where: {
      userId: userId,
      containerId: process.env.CONTAINER_ID,
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
      <Link
        href={`/admin/posts`}
        className="mb-6 flex items-center text-sm transition hover:opacity-75"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {currentLanguage.post_setup_backToPostAdminList_button_text}
      </Link>
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
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-16">
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
              <span className="pl-1 text-xs text-rose-600">{currentLanguage.requiredFields}</span>
            </div>
            <CategoryForm
              initialData={post}
              postId={post.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Image} />
              <h2 className="text-xl">
                {currentLanguage.post_setup_image_title}
              </h2>
              <span className="pl-1 text-xs text-rose-600">{currentLanguage.requiredFields}</span>
            </div>
            <ImageForm
              initialData={post}
              postId={post.id}
              />
            <ScheduleDateForm
            // @ts-ignore
               initialData={post}
               postId={post.id}
              />
          </div>
        </div>
      </div>
    </>
   );
}
 
export default PostIdPage;