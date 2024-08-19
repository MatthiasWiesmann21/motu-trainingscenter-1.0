import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarChat } from "./sidebar_chat";

export const MobileSidebarChat = (props: any) => {
  const { serverId } = props;
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="bg-white p-0">
        <div className="w-full">
          <SidebarChat serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
