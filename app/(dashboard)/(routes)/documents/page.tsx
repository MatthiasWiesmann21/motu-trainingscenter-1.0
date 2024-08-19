"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AssetsTable from "./_components/asset-table";
import Image from "next/image";
import noFolder from "../../../../assets/icons/no folder.png";
import ClubyteLoader from "@/components/ui/clubyte-loader";
import { useTheme } from "next-themes";

export type DocumentFolderTree = {
  name: string;
  id: string;
  key: string;
  subFolders: DocumentFolderTree[];
  files: DocumentFile[];
};
export type DocumentFile = {
  name: string;
  id: string;
  key: string;
  folder: DocumentFolderTree;
};

const DocumentPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [folderStructure, setFolderStructure] = useState<any>(null);
  const { theme } = useTheme();

  const getFolder = async () => {
    try {
      const response = await axios.get(`/api/documents/list`);
      setIsLoading(false);
      setFolderStructure(response.data.data);
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFolder();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {theme === "dark" ? (
          <ClubyteLoader className="w-64 h-64" theme="dark" color="110524" />
        ) : (
          <ClubyteLoader className="w-64 h-64" theme="light" color="ffffff" />
        )}
      </div>
    );
  } else if (folderStructure == null) {
    return (
      <div className="flex h-full w-full items-center justify-around">
        <Image priority src={noFolder} alt="wqer" />
      </div>
    );
  } else
    return (
      <div className="no-scrollbar m-4 rounded-lg bg-slate-100/60 dark:bg-[#0c0319]">
        <AssetsTable folderStructure={folderStructure} />
      </div>
    );
};

export default DocumentPage;
