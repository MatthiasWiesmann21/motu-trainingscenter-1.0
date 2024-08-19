import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutGridIcon } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { Actions } from "./_components/actions";
import { ColorForm } from "./_components/color-form";
import { CategoryTypeForm } from "./_components/categorytype-form";
import { languageServer } from "@/lib/check-language-server";
import Link from "next/link";

const CategoryIdPage = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const { userId } = auth();
  const currentLanguage = await languageServer();
  if (!userId) {
    return redirect("/");
  }

  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
      containerId: process.env.CONTAINER_ID,
    },
  });

  if (!category) {
    return redirect("/");
  }

  const requiredFields = [category.name];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!category.isPublished && (
        <Banner label={currentLanguage.category_unpublish_banner} />
      )}
      <div className="p-6">
        <Link
          href={`/admin/categories`}
          className="mb-6 flex items-center text-sm transition hover:opacity-75"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentLanguage.category_setup_backToCategoryAdminList_button_text}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              {currentLanguage.category_setup_title}
            </h1>
            <span className="text-sm text-slate-700 dark:text-[#ffffff]">
              {currentLanguage.category_setup_undertitle} {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            categoryId={params.categoryId}
            isPublished={category.isPublished}
          />
        </div>
        <div className="mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutGridIcon} />
              <h2 className="text-xl">
                {currentLanguage.category_setup_customize_title}
              </h2>
              <span className="pl-1 text-xs text-rose-600">
                {currentLanguage.requiredFields}
              </span>
            </div>
            <TitleForm initialData={category} categoryId={category.id} />
            <ColorForm initialData={category} categoryId={category.id} />
            <CategoryTypeForm initialData={category} categoryId={category.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryIdPage;
