import dynamic from "next/dynamic";
import { Category, Post } from "@prisma/client";
import NewsWrapper from "./_components/newsWrapper";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
};

type PostWithProgressWithCategory = Post & {
  category: Category | null;
  likesCount: number;
  currentLike: boolean;
  commentsWithLikes: any;
  commentsCount: number;
};

interface SearchPageProps {
  searchParams: {
    categoryId: string;
  };
}

const NewsPage = async ({ searchParams }: SearchPageProps) => {

  const session = await getServerSession(authOptions);
  const profile = await currentProfile();

  if (!session?.user) {
    return redirect("/");
  }

  const categories = await db?.category?.findMany({
    where: {
      isPublished: true,
      isNewsCategory: true,
      containerId: session?.user?.profile?.containerId,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  const container: any = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  return (
    <NewsWrapper
      searchParams={searchParams}
      categories={categories}
      ThemeColor={container?.ThemeColor!}
      DarkThemeColor={container?.DarkThemeColor!}
      profileImage={profile?.imageUrl!}
      profileRole={profile?.role!}
      currentProfileId={profile?.id!}
      // TODO: Add course, chapter, liveEvent to the props
    />
  );
};

export default dynamic(() => Promise?.resolve(NewsPage), { ssr: false });
