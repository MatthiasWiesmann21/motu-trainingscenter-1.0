"use client";

import React, { useCallback, useState } from "react";
import axios from "axios";
import { isOwner } from "@/lib/owner";
import { useAuth } from "@clerk/nextjs";
import FlyoutMenuCreate from "./flyout-menu-create";
import FlyoutMenuSetting from "./flyout-menu-setting";
import Modal from "react-modal";
import { Download, File, FileText, FolderOpen } from "lucide-react";
import { useIsAdmin, useIsOperator } from "@/lib/roleCheck";
import { useLanguage } from "@/lib/check-language";
import { ScrollArea } from "@/components/scroll-area";

export interface FolderTreeProps {
  name: string;
  childrens?: FolderTreeProps[] | null;
  id: string;
  isPublic: any;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
  },
};

interface AssetsTableProps {
  folderStructure: any;
  root?: boolean;
}

const currentDocPath = "/documents/";
const AssetsTable: React.FC<AssetsTableProps> = (props) => {
  const { folderStructure } = props;
  const { userId } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const i = 0;
  const [newFileName, setNewFileName] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [renamingItem, setRenamingItem] = useState<FolderTreeProps | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isFolder, setIsFolder] = useState("");
  const [isRenameFolder, setIsRenameFolder] = useState(false);
  const currentLanguage = useLanguage();

  const isAdmin = useIsAdmin();
  const isOperator = useIsOperator();

  const canAccess = isAdmin || isOperator || isOwner(userId);

  function openModal() {
    setIsOpen(true);
  }
  const handleRenameClick = (item: FolderTreeProps, isFolder: boolean) => {
    setRenamingItem(item);
    setIsRenameFolder(isFolder);
    openModal();
  };

  function closeModal() {
    setIsOpen(false);
  }

  const renameFolder = async () => {
    if (newFileName == null || renamingItem?.id == null) {
      return;
    }

    try {
      const response = await axios?.post(
        !isRenameFolder
          ? `/api/documents/edit/file`
          : `/api/documents/edit/folder`,
        {
          isPublic: renamingItem.isPublic,
          id: renamingItem.id,
          ...(!isRenameFolder
            ? {
                fileName: newFileName,
              }
            : {
                folderName: newFileName,
              }),
        }
      );
      location.reload();
    } catch (e) {
      console.log(e);
    }
  };
  const deleteDirectory = async () => {
    console.log("here", renamingItem?.id == null, renamingItem);
    const isFile: Boolean = isFolder !== "folder";
    if (renamingItem?.id == null) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        isFile ? `/api/documents/delete/file` : `/api/documents/delete/folder`,
        {
          id: renamingItem.id,
        }
      );
      if (response.status === 200) {
        console.log("deleted successfully");
      } else {
        console.error("Failed to delete");
      }
      setLoading(false);
      location.reload();
      setIsFolder("");
    } catch (error) {
      console.error("Error deleting:", error);
      setLoading(false);
      setIsFolder("");
    }
  };

  const handleDownload = useCallback(async (key: string, name: string) => {
    //TODO: Download logic here
    setDownloading(true);
    const response = await axios.get(`/api/documents/download/file?key=${key}`);
    const { fileExtension } = response.data.data;

    const downloadURL = response.data.data.downloadUrl;
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadURL;
    downloadLink.download = `name.${fileExtension}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setDownloading(false);
  }, []);

  const formatDate = (dateTimeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = new Date(dateTimeString).toLocaleString(
      "en-US",
      options
    );

    return formattedDate;
  };

  const onEditClick = (id: any, isFolder: Boolean) => {
    const obj = {
      id,
      action: "edit",
    };
    const str = JSON?.stringify(obj);
    const encoded = btoa(str);
    location.href = `/documents/${encoded}/${
      isFolder ? "createfolder" : "createfile"
    }`;
  };

  return (
    <div className="overflow-hidden px-4 py-4 bg-transparent">
      <Modal
        isOpen={modalIsOpen && renamingItem !== null}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Rename Modal"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {currentLanguage.rename + "*"}
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:text-gray-300 sm:text-sm sm:leading-6"
              placeholder="Enter the new name"
              defaultValue={renamingItem?.name}
              onChange={(e) => {
                setNewFileName(e.target.value);
              }} // Set the default value to the current item's name
            />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="mx-2 rounded-md bg-slate-300 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-slate-400"
            onClick={closeModal}
          >
            {currentLanguage.cancel}
          </button>
          <button
            type="button"
            className="mx-2 rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
            onClick={() => {
              // TODO: Save logic here
              renameFolder();
            }}
          >
            {currentLanguage.save}
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isFolder !== ""}
        onRequestClose={() => setIsFolder("")}
        style={customStyles}
        contentLabel="Rename Modal"
      >
        <div>
          <p className="text-center dark:text-gray-900">
            {currentLanguage.are_you_sure_you_want_to_delete}
          </p>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="mx-2 rounded-md bg-slate-300 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-slate-400"
            onClick={() => setIsFolder("")}
          >
            {currentLanguage.cancel}
          </button>
          <button
            type="button"
            className="mx-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-800"
            disabled={loading}
            onClick={() => {
              deleteDirectory();
            }}
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
            ) : (
              <>{currentLanguage.delete}</>
            )}
          </button>
        </div>
      </Modal>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-600 dark:text-gray-200 ">
            {currentLanguage.document_hub}
          </h1>
        </div>

        <div
          className={`${
            canAccess ? "block" : "hidden"
          } mt-4 sm:ml-16 sm:mt-0 sm:flex-none`}
        >
          <FlyoutMenuCreate key={`flyout-create-0`} />
        </div>
      </div>
      <ScrollArea>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full overflow-y-scroll py-2 align-middle sm:px-6 lg:px-8">
            <div className="h-full">
              <table className="w-full table-fixed divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-4 sm:w-18 sm:px-8">
                      <span className="w-full py-3 text-sm font-semibold text-gray-900 dark:text-gray-300">
                        {currentLanguage.type}
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-300"
                    >
                      {currentLanguage.name}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300"
                    >
                      {currentLanguage.created_at}
                    </th>
                  </tr>
                </thead>
                <tbody className="h-full divide-y divide-gray-200 bg-transparent">
                  {folderStructure?.subFolders?.map(
                    (item: any, i: number) =>
                      // isPublic
                      (canAccess ? true : item?.isPublic) && (
                        <tr key={i}>
                          <td className="relative px-5 sm:w-12 lg:w-12">
                            <div
                              onClick={() =>
                                (location.href = `${currentDocPath}${item.id}`)
                              }
                              className="m-1 mr-3 cursor-pointer rounded bg-slate-300 p-3 dark:bg-slate-600 flex items-center justify-center"
                              style={{ width: '50px', height: '50px' }}
                            >
                              <FolderOpen />
                            </div>
                          </td>
                          <td
                            onClick={() =>
                              (location.href = `${currentDocPath}${item.id}`)
                            }
                            className="cursor-pointer whitespace-nowrap py-4 pr-3 text-sm font-medium overflow-auto no-scrollbar text-gray-900 dark:text-gray-200"
                          >
                            {item.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-200">
                            {formatDate(item.createdAt)}
                          </td>
                          <td
                            className={`relative whitespace-nowrap px-3 text-sm text-gray-500`}
                          ></td>
                          <td
                            className={`${
                              !canAccess && "hidden"
                            } relative whitespace-nowrap px-3 text-sm text-gray-500 dark:text-gray-200`}
                          >
                            <div className=" ">
                              <FlyoutMenuSetting
                                type="folder"
                                index={i}
                                key={i?.toString()}
                                isMenuOpen={isMenuOpen}
                                setMenuOpen={setMenuOpen}
                                onRenameClick={() => {
                                  handleRenameClick(item, true);
                                }}
                                onDeleteClick={() => {
                                  setIsFolder("folder");
                                  setRenamingItem(item);
                                }}
                                onEditClick={() => onEditClick(item?.id, true)}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                  )}
                  {folderStructure?.files?.map(
                    (item: any, i: number) =>
                      // isPublic
                      (canAccess ? true : item?.isPublic) && (
                        <tr key={i}>
                          <td className="relative px-5 sm:w-12 lg:w-12">
                            <div className="m-1 mr-3 cursor-not-allowed rounded bg-slate-300 p-3 dark:bg-slate-600 flex items-center justify-center"
                            style={{ width: '50px', height: '50px' }}
                            >
                              <File className="w-6 h-6" />
                            </div>
                          </td>
                          <td className="cursor-not-allowed whitespace-nowrap overflow-auto no-scrollbar py-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200">
                            {item.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-200">
                            {formatDate(item.createdAt)}
                          </td>
                          <td
                            className={`relative cursor-pointer whitespace-nowrap px-3 text-sm text-gray-500`}
                          >
                            <div
                              className=" "
                              onClick={() =>
                                handleDownload(item.key, item.name)
                              }
                            >
                              <Download className="h-5 w-5 text-gray-200" />
                            </div>
                          </td>
                          <td
                            className={`${
                              !canAccess && "hidden"
                            } relative whitespace-nowrap px-3 text-sm text-gray-500 dark:text-gray-200`}
                          >
                            <div className=" ">
                              <FlyoutMenuSetting
                                index={i}
                                type="file"
                                key={i?.toString()}
                                isMenuOpen={isMenuOpen}
                                setMenuOpen={setMenuOpen}
                                onRenameClick={() => {
                                  handleRenameClick(item, false);
                                }}
                                onDeleteClick={() => {
                                  setIsFolder("file");
                                  setRenamingItem(item);
                                }}
                                onEditClick={() => onEditClick(item?.id, false)}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </ScrollArea>
    </div>
  );
};

export default AssetsTable;
