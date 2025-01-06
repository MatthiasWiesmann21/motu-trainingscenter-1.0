import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { getEvents } from "@/actions/get-events";
import LiveEventWrapper from "./_components/live-event-wrapper";
import getBase64 from "@/lib/getLocalbase64";
import authOptions from "@/lib/auth"; // Make sure you have authOptions configured
import { getServerSession } from "next-auth";
import { isAdmin } from "@/lib/roleCheckServer";
import { currentProfile } from "@/lib/current-profile";

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
  // Get the session from NextAuth
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const userId = session.user.id;

  const profile = await currentProfile();

  const categories = await db.category.findMany({
    where: {
      isPublished: true,
      isLiveEventCategory: true,
      containerId: session?.user?.profile?.containerId,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          LiveEvent: {
            where: {
              isPublished: true
            }
          }
        },
      },
    },
  });

  const liveEvents = await getEvents({
    userId,
    ...searchParams,
    containerId: session?.user?.profile?.containerId,
  });

  const container = await db?.container?.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  if (container?.clientPackage === "STARTER") {
    return redirect("/dashboard");
  }

  return (
    <LiveEventWrapper
      liveEvents={liveEvents}
      categories={categories}
      searchParams={searchParams}
      container={container}
      profileRole={profile?.role!}
    />
  );
};

export default SearchPage;