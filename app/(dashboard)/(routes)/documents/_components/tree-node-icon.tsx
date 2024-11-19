"use client";

import {
  Folder,
  File,
  FileText,
  FileSpreadsheetIcon,
  LucideIcon,
} from "lucide-react";

interface TreeNodeIconProps {
  name: string;
  isFolder: Boolean;
  className: string;
}

const FileIcons: { [key: string]: LucideIcon } = {
  txt: FileText,
  xlxs: FileSpreadsheetIcon,
};

const TreeNodeIcon = ({ name, isFolder, className }: TreeNodeIconProps) => {
  if (isFolder) {
    return <Folder className={className} />;
  }

  const extension = name.split(".").pop();
  if (extension == null || FileIcons[extension] == null) {
    return <File className={className} />;
  }

  const Icon = FileIcons[extension];

  return <Icon className={className} />;
};
export default TreeNodeIcon;
