import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full md:pl-60">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-60 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="h-full pt-[80px] md:pl-60">{children}</main>
    </div>
  );
};

export default DashboardLayout;
