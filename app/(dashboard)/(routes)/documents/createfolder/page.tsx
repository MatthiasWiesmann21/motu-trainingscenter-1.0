"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, usePathname, useRouter } from "next/navigation";
import PathMaker from "../_components/path-maker";
import { useLanguage } from "@/lib/check-language";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useIsAdmin, useIsClientAdmin, useIsOperator } from "@/lib/roleCheck";

type Params = {
  id: string;
  action: string;
};

const DocumentCreatePage = () => {
  const currentLanguage = useLanguage();
  const [folderName, setFolderName] = useState("");
  const [isPublic, setPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState("");
  const isAdmin = useIsAdmin();
  const isOperator = useIsOperator();
  const isClientAdmin = useIsClientAdmin();
  const router = useRouter();

  if (!isAdmin && !isOperator && !isClientAdmin) {
    return router.push("/documents");
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const encodedObj = useParams()?.id as string;

  // Initialize id and action with default values
  let id: string | string[];
  let action: string | undefined;

  if (uuidPattern.test(useParams()?.id as string)) {
    // If the id matches the pattern, use it directly
    id = encodedObj;
  } else {
    try {
      // Otherwise, decode the encoded object
      const decodedObj = JSON.parse(
        atob(encodedObj?.replace(/%3D/g, "="))
      ) as Params;
      id = decodedObj.id;
      action = decodedObj.action;
    } catch (error) {
      // Handle any decoding errors here
      console.error("Error decoding object:", error);
    }
  }
  const isEdit = action === "edit";

  useEffect(() => {
    if (!id || !isEdit) return;
    const getFolderDetails = async () => {
      const response = await axios?.get(`/api/documents/get/folder?id=${id}`);
      setFolderName(response?.data?.data?.name);
      setPublic(response?.data?.data?.isPublic);
      setParentId(response?.data?.data?.parentFolderId);
    };
    getFolderDetails();
  }, []);

  const createFolder = async () => {
    if (folderName == null || folderName.length < 1) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios?.post(
        isEdit ? `/api/documents/edit/folder` : `/api/documents/upload/folder`,
        {
          folderName: folderName,
          isPublic: isPublic,
          ...(isEdit
            ? {
                id: id, // or newFileName, depending on your logic
              }
            : {
                id: encodedObj,
              }),
        }
      );
      location.href = isEdit
        ? `/documents/${response.data.data.parentFolderId || ""}`
        : `/documents/${response.data.data.parentFolderId || ""}`;
      setFolderName("");
      setLoading(false);
      toast.success("Folder created successfully");
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <div className="mx-4 my-4">
      <div className="my-4 ">
        <PathMaker />
      </div>
      <div className="my-2 sm:flex-auto">
        <h1 className="text-2xl font-semibold leading-6 text-gray-600 dark:text-gray-300">
          {`${
            isEdit
              ? `${currentLanguage.edit_folder}`
              : `${currentLanguage.create_folder}`
          }`}
        </h1>
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
        >
          {currentLanguage.name + "*"}
        </label>
        <div className="mt-1">
          <Input
            type="name"
            name="name"
            id="name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="rounded-md"
            placeholder={currentLanguage.placeholder}
          />
        </div>
      </div>
      <div className="my-2 flex items-center">
        <Switch checked={isPublic} onCheckedChange={() => setPublic(!isPublic)}  />
        <span className="ml-3 text-sm" id="annual-billing-label">
          <span className="font-medium text-gray-900 dark:text-gray-300">
            {currentLanguage.public}
          </span>
        </span>
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          href={`/documents/${parentId || ""}`}
          type="button"
          className="rounded-md px-3.5 py-2.5 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]"
        >
          {currentLanguage.cancel}
        </Link>
        <Button
          onClick={createFolder}
          type="button"
          disabled={loading}
          className="mx-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm"
        >
          {isEdit ? (
            `${currentLanguage.edit}`
          ) : (
            `${currentLanguage.create}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentCreatePage;