import React from "react";
import { useParams } from "next/navigation";
import { FilePlus, FolderPlus, Plus, PlusCircle, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/check-language";

type Params = {
  id: string;
};

const FlyoutMenuCreate = () => {
  const { id } = useParams() as Params;
  const currentLanguage = useLanguage();

  const onCLickCreateFile = async () => {
    if (!id) {
      location.href = "/documents/createfile";
    } else {
      location.href = `/documents/${id}/createfile`;
    }
  };

  const onCLickCreateFolder = async () => {
    if (!id) {
      location.href = "/documents/createfolder";
    } else {
      location.href = `/documents/${id}/createfolder`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="border-2 border-gray-300 bg-transparent"
          variant="outline"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="pl-2 pr-2 text-sm">{currentLanguage.create}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onCLickCreateFile}>
          <FilePlus className="mr-2 h-5 w-5" />
          {currentLanguage.create_file}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCLickCreateFolder}>
          <FolderPlus className="mr-2 h-5 w-5" />
          {currentLanguage.create_folder}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FlyoutMenuCreate;
