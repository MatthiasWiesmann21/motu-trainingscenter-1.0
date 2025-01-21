import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { getEvents } from "@/actions/get-events";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions from "@/lib/auth";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import GoBackButton from "@/components/goBackButton";

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

  const likesData = events.map(event => ({
    name: event.title || "Untitled",
    total: event.likes?.length || 0,
  }));

  return (
    <div className="p-6">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label={currentLanguage.analytic_events_totalEvents_label}
          value={totalEvents}
        />
        <DataCard
          label={currentLanguage.analytic_events_upcomingEvents_label}
          value={upcomingEvents}
        />
        <DataCard
          label={currentLanguage.analytic_events_pastEvents_label}
          value={pastEvents}
        />
      </div>
      <Chart data={likesData} label={currentLanguage.analytic_events_totalEventsLikes_label} />
    </div>
  );
};

export default EventAnalyticsPage;