"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, usePathname } from "next/navigation";
import PathMaker from "../_components/path-maker";
import { useLanguage } from "@/lib/check-language";

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
          <input
            type="name"
            name="name"
            id="name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:text-gray-300 sm:text-sm sm:leading-6"
            placeholder={currentLanguage.placeholder}
          />
        </div>
      </div>
      <div className="my-2 flex items-center">
        <button
          onClick={() => setPublic(!isPublic)}
          type="button"
          className={`${isPublic && "bg-sky-600 dark:bg-gray-600"} ${
            !isPublic && "bg-gray-400"
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
          role="switch"
          aria-checked="false"
          aria-labelledby="annual-billing-label"
        >
          <span
            aria-hidden="true"
            className={`${isPublic && "translate-x-5"} ${
              !isPublic && "translate-x-0"
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          ></span>
        </button>
        <span className="ml-3 text-sm" id="annual-billing-label">
          <span className="font-medium text-gray-900 dark:text-gray-300">
            {currentLanguage.public}
          </span>
        </span>
      </div>
      <div className="mt-4 flex flex-row-reverse">
        <button
          onClick={createFolder}
          type="button"
          disabled={loading}
          className="mx-2 rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
        >
          {loading ? (
            <svg
              className="mr-3 flex h-5 w-5 animate-spin items-center justify-center text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8.001 8.001 0 014.373 6H2v4.373zM13 4.373V2a8 8 0 018 8h-4.373A7.961 7.961 0 0113 4.373zm4.373 9.254A8.001 8.001 0 0113 20.627v-4.373h4.373z"
              ></path>
            </svg>
          ) : isEdit ? (
            `${currentLanguage.edit}`
          ) : (
            `${currentLanguage.create}`
          )}
        </button>
        <a
          href={`/documents/${parentId || ""}`}
          type="button"
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {currentLanguage.cancel}
        </a>
      </div>
    </div>
  );
};

export default DocumentCreatePage;
