import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";

import { getAnalytics } from "@/actions/get-analytics";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions from "@/lib/auth";

const AnalyticsPage = async () => {
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

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  const analyticsCards = [
    {
      title: "Finance Analytics",
      description: "View financial metrics, revenue, and sales data",
      href: "/admin/analytics/finance",
    },
    {
      title: "Course Analytics",
      description: "Track course engagement, completion rates, and popularity",
      href: "/admin/analytics/courses",
    },
    {
      title: "Live Event Analytics",
      description: "Monitor event attendance, engagement, and performance",
      href: "/admin/analytics/events",
    },
    {
      title: "Post Analytics",
      description: "Analyze post engagement, comments, and user interaction",
      href: "/admin/analytics/posts",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card className="p-4 hover:shadow-md transition-all cursor-pointer h-full">
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;