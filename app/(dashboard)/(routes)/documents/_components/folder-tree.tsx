"use client";
import React, { useCallback, useState } from "react";
import TreeNodeIcon from "./tree-node-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocumentFolderTree } from "../page";
import { Button } from "@/components/ui/button";
import axios from "axios";

export interface FolderTreeProps {
  name: string;
  childrens?: FolderTreeProps[] | null;
  _id: string;
}

const basePath = process.env.BASE_PATH ?? "http://localhost:3000/";
const currentDocPath = basePath + "/documents/";
const FolderTree: React.FC<DocumentFolderTree> = ({
  name,
  files,
  subFolders,
  id,
  key,
}) => {
  const pathname = usePathname();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async (key: string, name: string) => {
    //TODO: Download logic here
    setDownloading(true);
    const response = await axios.get(`/api/documents/download/file?key=${key}`);
    console.log(response.data.data);

    const downloadURL = response.data.data.downloadUrl;
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadURL;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    console.log(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setDownloading(false);
  }, []);

  return (
    <div>
      {files.map((item, index) => {
        return (
          <div className="mt-2 flex flex-row items-center" key={index}>
            <div className="flex   ">
              <TreeNodeIcon
                className="mr-2"
                name={item.name}
                isFolder={false}
              />
              {item.name}
            </div>
            {
              <Button
                disabled={downloading}
                className="ml-2 bg-white font-bold text-black hover:bg-black hover:text-white"
                onClick={() => handleDownload(item.key, item.name)}
              >
                Download
              </Button>
            }
          </div>
        );
      })}

      {subFolders.map((item, index) => {
        return (
          <div className="mt-2  flex" key={index}>
            <Link href={`${currentDocPath}${item.key}`} className="flex">
              <TreeNodeIcon className="mr-2" name={item.name} isFolder={true} />
              {item.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default FolderTree;
