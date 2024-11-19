import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
    <div className="flex p-2 h-3/4 w-full items-center justify-center">
      <main className=" h-[calc(100vh-100px)] w-full overflow-hidden rounded-xl border-2 dark:bg-[#0A0118]">
        <SocketProvider>
          <QueryProvider>{children}</QueryProvider>
        </SocketProvider>
      </main>
    </div>
    </div>
  );
};

export default MainLayout;
