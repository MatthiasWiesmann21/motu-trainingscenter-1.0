"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AssetsTable from "./_components/asset-table";
import Image from "next/image";
import noFolder from "../../../../assets/icons/no folder.png";
import ClubyteLoader from "@/components/ui/clubyte-loader";
import { useTheme } from "next-themes";
import { FileX } from "lucide-react";
import { useLanguage } from "@/lib/check-language";
import { get } from "http";

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
  const [container, setContainer] = useState<any>(null);
  const { theme } = useTheme();
  const currentLanguage = useLanguage();

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

  const getContainer = async () => {
    try {
      const response = await axios.get(`/api/containers`);
      setContainer(response.data.data);
      return response.data.data;
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    getContainer();
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
      <div className="flex items-center justify-center align-middle gap-2 px-4 py-6">
        <FileX width={50} height={50} className="text-slate-400 dark:text-slate-600" />
        <p className="text-xl">{currentLanguage.chapter_attachments_NoDocuments}</p>
      </div>
    );
  } else
    return (
      <div className="no-scrollbar m-4 rounded-lg border-2 bg-white dark:bg-[#0c0319]">
        <AssetsTable folderStructure={folderStructure} />
      </div>
    );
};

export default DocumentPage;
