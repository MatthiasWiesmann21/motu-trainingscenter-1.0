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
      <SheetContent side="left" className=" w-full bg-white p-0">
        <SidebarChat serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
