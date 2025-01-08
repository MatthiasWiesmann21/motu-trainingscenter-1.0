"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import PathMaker from "../../_components/path-maker";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/check-language";
import { Switch } from "@/components/ui/switch"; // Import Switch from UI components
import { Input } from "@/components/ui/input";   // Import Input from UI components
import { Button } from "@/components/ui/button"; // Import Button for consistency
import Link from "next/link";                    // For cancel button
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useIsAdmin, useIsClientAdmin, useIsOperator } from "@/lib/roleCheck";

type Params = {
  id: string;
  action: string;
};

const DocumentCreatePage = () => {
  const [file, setFile] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [parentId, setParentId] = useState("");
  const [isPublic, setPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const encodedObj = useParams()?.id as string;
  const currentLanguage = useLanguage();
  const router = useRouter();

  const isAdmin = useIsAdmin();
  const isOperator = useIsOperator();
  const isClientAdmin = useIsClientAdmin();

  if (!isAdmin && !isOperator && !isClientAdmin) {
    return router.push("/documents");
  }

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

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUploadButtonClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput || !fileInput.click) return;
    fileInput.click();
  };

  const handleFileUpdate = async () => {
    try {
      const response = await axios?.post(`/api/documents/edit/file`, {
        fileName: fileName,
        isPublic: isPublic,
        id: id,
      });
      location.href = `/documents/${response.data.data.folderId || ""}`;
      setFileName("");
      toast.success("File updated successfully");
    } catch (e) {
      console.log(e);
    }
  };

  const handleFileUpload = async () => {
    if (file == null) {
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("isPublic", `${isPublic}`);
      formData.append("name", `${fileName}`);
      formData.append("file", file);
      formData.append("id", encodedObj);

      const response = await axios.post(
        `/api/documents/upload/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      location.href = `/documents/${response.data.data.file.folderId || ""}`;
      setLoading(false);
      toast.success("File uploaded successfully");
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !isEdit) return;
    const getFileDetails = async () => {
      const response = await axios?.get(`/api/documents/get/file?id=${id}`);
      setFileName(response?.data?.data?.name);
      setPublic(response?.data?.data?.isPublic);
      setParentId(response?.data?.data?.folderId);
    };
    getFileDetails();
  }, []);

  return (
    <div className="mx-4 my-4">
      <div className="my-4">
        <PathMaker />
      </div>
      <div className="my-2 sm:flex-auto">
        <h1 className="text-2xl font-semibold leading-6 text-gray-600 dark:text-gray-300">
          {isEdit ? `${currentLanguage.edit_file}` : `${currentLanguage.create_file}`}
        </h1>
      </div>

      {/* Folder name input */}
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
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="block rounded-md px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:bg-[#1e293b] dark:text-gray-300 sm:text-sm sm:leading-6"
            placeholder={currentLanguage.placeholder_file}
          />
        </div>
      </div>

      {/* File input */}
      <div className="mt-4">
        <label
          htmlFor="file"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
        >
          {currentLanguage.file + "*"}
        </label>
        {!isEdit && (
          <button
            onClick={handleUploadButtonClick}
            type="button"
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 dark:hover:bg-[#1e293b]"
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-gray-300">
              {currentLanguage.upload_file}
            </span>
          </button>
        )}
        <label
          htmlFor="fileName"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-white mt-2"
        >
          {file?.name}
        </label>
      </div>

      {/* Switch for public/private toggle */}
      <div className="my-2 flex items-center">
        <Switch checked={isPublic} onCheckedChange={() => setPublic(!isPublic)} />
        <span className="ml-3 text-sm" id="annual-billing-label">
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {currentLanguage.public}
          </span>
        </span>
      </div>

      {/* Create/Cancel buttons */}
      <div className="mt-4 flex justify-end">
        <Link
          href={`/documents/${parentId || ""}`}
          type="button"
          className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e293b] dark:text-gray-300"
        >
          {currentLanguage.cancel}
        </Link>
        <Button
          onClick={isEdit ? handleFileUpdate : handleFileUpload}
          disabled={loading}
          className="mx-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm"
        >
          {isEdit ? `${currentLanguage.update}` : `${currentLanguage.save}`}
        </Button>
      </div>
    </div>
  );
};

export default DocumentCreatePage;