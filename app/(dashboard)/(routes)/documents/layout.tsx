import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
};

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main className="h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
