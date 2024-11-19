import { getServerSession } from "next-auth/next";
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
import authOptions from "@/lib/auth"; // Ensure this is properly configured
import GoBackButton from "@/components/goBackButton";
import { TextColorForm } from "./_components/textcolor-form";
import { DarkTextColorForm } from "./_components/dark-textcolor-form";

const CategoryIdPage = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const currentLanguage = await languageServer();

  if (!userId) {
    return redirect("/");
  }

  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
      containerId: session?.user?.profile?.containerId,
    },
  });

  if (!category) {
    return redirect("/");
  }

  const requiredFields = [category.name, category.colorCode];
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
        <GoBackButton buttonText={currentLanguage.goBack_button_text} />
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
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            <TextColorForm initialData={category} categoryId={category.id} />
            <DarkTextColorForm initialData={category} categoryId={category.id} />
          </div>
          <div className="lg:mt-12">
            <CategoryTypeForm initialData={category} categoryId={category.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryIdPage;
