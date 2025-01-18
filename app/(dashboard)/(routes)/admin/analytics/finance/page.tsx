import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";

import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions  from "@/lib/auth"; // Ensure this is properly configured
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import GoBackButton from "@/components/goBackButton";

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

  return (
    <div className="p-6">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label={currentLanguage.analytics_total_revenue_label}
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label={currentLanguage.analytics_total_sales_label}
          value={totalSales}
        />
      </div>
      <Chart data={data}/>
    </div>
  );
};

export default AnalyticsPage;