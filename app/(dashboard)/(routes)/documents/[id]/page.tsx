"use client";

import PathMaker from "../_components/path-maker";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { DocumentFolderTree } from "../page";
import AssetsTable from "./../_components/asset-table";
import ClubyteLoader from "@/components/ui/clubyte-loader";
import { FileX } from "lucide-react";
import { useLanguage } from "@/lib/check-language";
import { useTheme } from "next-themes";

const DocumentPage = () => {
  const parentKey = usePathname();
  const currentLanguage = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const [folderStructure, setFolderStructure] =
    useState<DocumentFolderTree | null>(null);

  const getFolder = async () => {
    if (parentKey == null) {
      return;
    }
    const response = await axios.get(
      `/api/documents/list?key=${parentKey.replace("/documents/", "")}`
    );
    setIsLoading(false);
    setFolderStructure(response.data.data);
  };

  useEffect(() => {
    getFolder();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {theme === "dark" ? (
          <ClubyteLoader className="h-64 w-64" theme="dark" color="110524" />
        ) : (
          <ClubyteLoader className="h-64 w-64" theme="light" color="ffffff" />
        )}
      </div>
    );
  } else if (folderStructure == null) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-6 align-middle">
        <FileX
          width={50}
          height={50}
          className="text-slate-400 dark:text-slate-600"
        />
        <p className="text-xl">
          {currentLanguage.chapter_attachments_NoDocuments}
        </p>
      </div>
    );
  } else
    return (
      <div className="ml-2 ">
        <div className="my-4 ">
          <PathMaker />
        </div>
        <div className="no-scrollbar m-4 rounded-lg border-2 bg-slate-100/60 dark:bg-[#0c0319]">
          <AssetsTable folderStructure={folderStructure} />
        </div>
      </div>
    );
};

export default DocumentPage;
