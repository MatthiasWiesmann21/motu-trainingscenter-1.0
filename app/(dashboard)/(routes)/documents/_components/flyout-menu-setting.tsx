import React, { useEffect } from "react";
import { FilesIcon, MoreVertical, PencilIcon, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";

interface FlyoutMenuSettingProps {
  index: number;
  onRenameClick: () => void;
  onDeleteClick: () => void;
  onEditClick: () => void;
  isMenuOpen: any;
  setMenuOpen: any;
  type: string;
}

const FlyoutMenuSetting: React.FC<FlyoutMenuSettingProps> = ({
  onRenameClick,
  onDeleteClick,
  onEditClick,
  setMenuOpen,
}) => {
  const currentLanguage = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as Element; // Cast event.target to Element
      // Close the flyout menu if clicked outside
      if (targetElement && !targetElement.closest(".flyout-create")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="border-0 bg-transparent" variant="outline">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEditClick}>
          <PencilIcon className="mr-2 h-4 w-4" />
          {currentLanguage.edit}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRenameClick}>
          <FilesIcon className="mr-2 h-4 w-4" />
          {currentLanguage.rename}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDeleteClick}>
          <Trash2Icon className="mr-2 h-4 w-4" />
          {currentLanguage.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FlyoutMenuSetting;
