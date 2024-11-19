import authOptions from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Documents",
};

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  // Check if session and containerId are available
  if (session?.user?.profile?.containerId) {
    // Fetch the container data from the database
    const container = await db.container.findUnique({
      where: { id: session.user.profile.containerId },
      select: { clientPackage: true },
    });

    // Redirect to /dashboard if the clientPackage is "STARTER"
    if (container?.clientPackage === "STARTER") {
      redirect("/dashboard");
      return null; // Prevent further rendering
    }
  }
  return (
    <div>
      <main className="h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
