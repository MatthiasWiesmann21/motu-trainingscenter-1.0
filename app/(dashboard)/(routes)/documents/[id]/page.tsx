"use client";

import PathMaker from "../_components/path-maker";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { DocumentFolderTree } from "../page";
import AssetsTable from "./../_components/asset-table";

const DocumentPage = () => {
  const parentKey = usePathname();

  const [folderStructure, setFolderStructure] =
    useState<DocumentFolderTree | null>(null);

  const getFolder = async () => {
    if (parentKey == null) {
      return;
    }
    const response = await axios.get(
      `/api/documents/list?key=${parentKey.replace("/documents/", "")}`
    );
    setFolderStructure(response.data.data);
  };
  useEffect(() => {
    getFolder();
  }, []);

  if (folderStructure == null) {
    return <div> Loading</div>;
  }

  return (
    <div className="ml-2 ">
      <div className="my-4 ">
        <PathMaker />
      </div>
      <div className="m-4 rounded-lg bg-slate-100/60 dark:bg-[#0c0319]">
      <AssetsTable folderStructure={folderStructure} root={false}></AssetsTable>
      </div>
    </div>
  );
};

export default DocumentPage;
