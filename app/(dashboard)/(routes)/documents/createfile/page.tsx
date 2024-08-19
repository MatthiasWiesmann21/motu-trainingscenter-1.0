"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import PathMaker from "../_components/path-maker";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/check-language";

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

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUploadButtonClick = () => {
    // Trigger the click event on the hidden input
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
    } catch (e) {
      console.log(e);
    }
  };

  const handleFileUpload = async () => {
    console.log("here");
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

      // formData.append('parentKey', )
      const response = await axios.post(
        `/api/documents/upload/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //removeLocalStorageItem('parentKey')
      location.href = `/documents/${response.data.data.file.folderId || ""}`;
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !isEdit) return;
    const getFileDetails = async () => {
      const response = await axios?.get(`/api/documents/get/file?id=${id}`);
      console.log(response.data.data);
      setFileName(response?.data?.data?.name);
      setPublic(response?.data?.data?.isPublic);
      setParentId(response?.data?.data?.folderId);
    };
    getFileDetails();
  }, []);

  return (
    <div className="mx-4 my-4">
      <div className="my-4 ">
        <PathMaker />
      </div>
      <div className="my-2 sm:flex-auto">
        <h1 className="text-2xl font-semibold leading-6 text-gray-600 dark:text-gray-300">
          {`${
            isEdit
              ? `${currentLanguage.edit_file}`
              : `${currentLanguage.create_file}`
          }`}
        </h1>
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
        >
          {currentLanguage.name + "*"}
        </label>
        <div className="mt-1">
          <input
            type="name"
            name="name"
            id="name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:text-gray-300 sm:text-sm sm:leading-6"
            placeholder={currentLanguage.placeholder}
          />
        </div>
      </div>

      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
      >
        {currentLanguage.file + "*"}
      </label>
      {!isEdit && (
        <button
          onClick={() => handleUploadButtonClick()}
          type="button"
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400"
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
            />
          </svg>
          <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-gray-300">
            {currentLanguage.upload_file}
          </span>
        </button>
      )}

      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-white "
      >
        {file?.name}
      </label>
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
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {currentLanguage.public}
          </span>
        </span>
      </div>
      <div className="mt-4 flex flex-row-reverse">
        <button
          onClick={() => (isEdit ? handleFileUpdate() : handleFileUpload())}
          type="button"
          className="mx-2 rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
          disabled={loading}
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
            `${currentLanguage.update}`
          ) : (
            `${currentLanguage.save}`
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
