import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { getEvents } from "@/actions/get-events";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions from "@/lib/auth";

import GoBackButton from "@/components/goBackButton";
import { DataCard } from "./_components/data-card";

const EventAnalyticsPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  
  const currentLanguage = await languageServer();

  if (!userId) {
    return redirect("/search");
  }

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const isRoleClientAdmin = await isClientAdmin();
  const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || isOwner(userId);

  if (!canAccess) {
    return redirect("/search");
  }

  const events = await getEvents({ userId });

  const totalEvents = events.length;
  // @ts-ignore
  const upcomingEvents = events.filter(event => new Date(event.startDateTime) > new Date()).length;
  // @ts-ignore
  const pastEvents = events.filter(event => new Date(event.endDateTime) <= new Date()).length;

  return (
    <div className="p-6">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label="Total Events"
          value={totalEvents}
        />
        <DataCard
          label="Upcoming Events"
          value={upcomingEvents}
        />
        <DataCard
          label="Past Events"
          value={pastEvents}
        />
      </div>
    </div>
  );
};

export default EventAnalyticsPage;