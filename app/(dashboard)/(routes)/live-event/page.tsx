import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { Metadata } from "next";
import { getEvents } from "@/actions/get-events";
import LiveEventWrapper from "./_components/live-event-wrapper";
import getBase64 from "@/lib/getLocalbase64";

export const metadata: Metadata = {
  title: "Live Events",
};

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    where: {
      isPublished: true,
      isLiveEventCategory: true,
      containerId: process.env.CONTAINER_ID,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { LiveEvent: true },
      },
    },
  });

  const liveEvents = await getEvents({
    userId,
    ...searchParams,
    containerId: process.env.CONTAINER_ID,
  });

  const container = await db?.container?.findUnique({
    where: {
      id: process.env.CONTAINER_ID,
    },
  });

  return (
    <LiveEventWrapper
      liveEvents={liveEvents}
      categories={categories}
      searchParams={searchParams}
      container={container}
    />
  );
};

export default SearchPage;
