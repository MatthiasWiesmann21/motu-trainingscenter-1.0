"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import PathMaker from "../../_components/path-maker";
import { useLanguage } from "@/lib/check-language";
import { Switch } from "@/components/ui/switch"; // Import Switch component from UI library
import { Input } from "@/components/ui/input"; // Import Input component for better styling
import { Button } from "@/components/ui/button"; // Import Button for consistency
import Link from "next/link"; // For cancel button
import toast from "react-hot-toast";
import { useIsAdmin, useIsClientAdmin, useIsOperator } from "@/lib/roleCheck";
import { useRouter } from "next/navigation";

type Params = {
  id: string;
  action: string;
};

const DocumentCreatePage = () => {
  const [folderName, setFolderName] = useState("");
  const [isPublic, setPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState("");
  const currentLanguage = useLanguage();
  const router = useRouter();

  const isAdmin = useIsAdmin();
  const isOperator = useIsOperator();
  const isClientAdmin = useIsClientAdmin();

  if (!isAdmin && !isOperator && !isClientAdmin) {
    return router.push("/documents");
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const encodedObj = useParams()?.id as string;

  let id: string | string[];
  let action: string | undefined;

  if (uuidPattern.test(useParams()?.id as string)) {
    id = encodedObj;
  } else {
    try {
      const decodedObj = JSON.parse(
        atob(encodedObj?.replace(/%3D/g, "="))
      ) as Params;
      id = decodedObj.id;
      action = decodedObj.action;
    } catch (error) {
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
      <div className="my-4">
        <PathMaker />
      </div>
      <div className="my-2 sm:flex-auto">
        <h1 className="text-2xl font-semibold leading-6 text-gray-600 dark:text-gray-300">
          {isEdit
            ? `${currentLanguage.edit_folder}`
            : `${currentLanguage.create_folder}`}
        </h1>
      </div>

      {/* Folder name input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
        >
          {currentLanguage.name + " *"}
        </label>
        <div className="mt-1">
          <Input
            type="text"
            name="name"
            id="name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:bg-[#1e293b] dark:text-gray-300 sm:text-sm sm:leading-6"
            placeholder={currentLanguage.placeholder}
          />
        </div>
      </div>

      {/* Public/Private switch */}
      <div className="my-2 flex items-center">
        <Switch
          checked={isPublic}
          onCheckedChange={() => setPublic(!isPublic)}
        />
        <span className="ml-3 text-sm" id="annual-billing-label">
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {currentLanguage.public}
          </span>
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex justify-end">
        <Link
          href={`/documents/${parentId || ""}`}
          type="button"
          className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#1e293b]"
        >
          {currentLanguage.cancel}
        </Link>
        <Button
          onClick={createFolder}
          disabled={loading}
          className="mx-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm"
        >
          {isEdit ? `${currentLanguage.edit}` : `${currentLanguage.create}`}
        </Button>
      </div>
    </div>
  );
};

export default DocumentCreatePage;