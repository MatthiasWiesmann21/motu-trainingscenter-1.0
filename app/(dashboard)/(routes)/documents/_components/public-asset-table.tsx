"use client";

import {
  ContextMenuTrigger,
  ContextMenu,
  ContextMenuItem,
} from "rctx-contextmenu";
import AppSVGIcon from "@/components/appsvgicon";

export interface FolderTreeProps {
  name: string;
  childrens?: FolderTreeProps[] | null;
  _id: string;
}

const basePath = process.env.BASE_PATH ?? "http://localhost:3000/";
const currentDocPath = basePath + "/documents/";
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
const PublicAssetsTable = ({ folderStructureList }: any) => (
  <div className="px-4 py-4 sm:px-2 lg:px-4">
    <div className="my-2 sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-semibold leading-6 text-gray-600 ">
          Document Hub
        </h1>
      </div>

      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <ContextMenuTrigger id="my-context-menu-2">
          <button
            type="button"
            className="flex rounded-md bg-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-600 shadow-xl hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <AppSVGIcon
              customclass={"h-5 w-5 text-gray-400"}
              icon={"plusIcon"}
            ></AppSVGIcon>
            Create
          </button>
        </ContextMenuTrigger>
      </div>
    </div>
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative">
            <table className="min-w-full table-fixed divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="relative px-8 sm:w-12 sm:px-6">
                    <input
                      type="checkbox"
                      className="absolute left-1 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="min-w-[12rem] py-3 text-sm font-semibold text-gray-900">
                      Type
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody className="h-full divide-y divide-gray-200 bg-white">
                {folderStructureList.map((folderStructure: any, i: number) => {
                  return (
                    <>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                        >{`User ${i + 1} shared`}</th>
                      </tr>
                      {folderStructure.subFolders.map(
                        (item: any, i: number) => {
                          return (
                            <tr key={i}>
                              <td className="relative px-7 sm:w-12 sm:px-6">
                                <input
                                  type="checkbox"
                                  className="absolute left-1 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <div
                                  onClick={() =>
                                    (location.href = `${currentDocPath}${item.key}`)
                                  }
                                  className="ml-3 cursor-pointer rounded bg-pink-100 p-2"
                                >
                                  <AppSVGIcon
                                    customclass={"mx-auto h-7"}
                                    icon={"folderIcon"}
                                  ></AppSVGIcon>{" "}
                                </div>
                              </td>
                              <td
                                onClick={() =>
                                  (location.href = `${currentDocPath}${item.key}`)
                                }
                                className="cursor-pointer whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900"
                              >
                                {item.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {formatDate(item.createdAt)}
                              </td>
                              <td className="relative cursor-pointer whitespace-nowrap px-3 text-sm text-gray-500">
                                <div className=" ">
                                  <ContextMenuTrigger id="my-context-menu-1">
                                    <AppSVGIcon
                                      customclass={"h-5"}
                                      icon={"contextMenuIcon"}
                                    ></AppSVGIcon>
                                  </ContextMenuTrigger>
                                  <ContextMenu id="my-context-menu-1">
                                    <ContextMenuItem>
                                      <div className="flex">
                                        <AppSVGIcon
                                          customclass={"mr-3 h-5"}
                                          icon={"editIcon"}
                                        ></AppSVGIcon>
                                        Edit
                                      </div>
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                      <div className="flex">
                                        <AppSVGIcon
                                          customclass={"mr-3 h-5"}
                                          icon={"renameIcon"}
                                        ></AppSVGIcon>
                                        Rename
                                      </div>
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                      <div className="flex">
                                        <AppSVGIcon
                                          customclass={"mr-3 h-5"}
                                          icon={"deleteIcon"}
                                        ></AppSVGIcon>
                                        Delete
                                      </div>
                                    </ContextMenuItem>
                                  </ContextMenu>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                      {folderStructure.files.map((item: any, i: number) => {
                        return (
                          <tr key={i}>
                            <td className="relative px-7 sm:w-12 sm:px-6">
                              <input
                                type="checkbox"
                                className="absolute left-1 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <div
                                onClick={() =>
                                  (location.href = `${currentDocPath}${item.key}`)
                                }
                                className="ml-3 cursor-pointer rounded bg-pink-100 p-2"
                              >
                                <AppSVGIcon
                                  customclass={"mx-auto h-7"}
                                  icon={"fileIcon"}
                                ></AppSVGIcon>
                              </div>
                            </td>
                            <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900">
                              {item.name + "dd"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatDate(item.createdAt)}
                            </td>
                            <td className="relative cursor-pointer whitespace-nowrap px-3 text-sm text-gray-500">
                              <div className=" ">
                                <ContextMenuTrigger id="my-context-menu-1">
                                  <AppSVGIcon
                                    customclass={"h-5"}
                                    icon={"contextMenuIcon"}
                                  ></AppSVGIcon>
                                </ContextMenuTrigger>
                                <ContextMenu id="my-context-menu-1">
                                  <ContextMenuItem>
                                    <div className="flex">
                                      <AppSVGIcon
                                        customclass={"mr-3 h-5"}
                                        icon={"editIcon"}
                                      ></AppSVGIcon>
                                      Edit
                                    </div>
                                  </ContextMenuItem>
                                  <ContextMenuItem>
                                    <div className="flex">
                                      <AppSVGIcon
                                        customclass={"mr-3 h-5"}
                                        icon={"renameIcon"}
                                      ></AppSVGIcon>
                                      Rename
                                    </div>
                                  </ContextMenuItem>
                                  <ContextMenuItem>
                                    <div className="flex">
                                      <AppSVGIcon
                                        customclass={"mr-3 h-5"}
                                        icon={"deleteIcon"}
                                      ></AppSVGIcon>
                                      Delete
                                    </div>
                                  </ContextMenuItem>
                                </ContextMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <ContextMenu id="my-context-menu-2">
      <ContextMenuItem>
        <div
          className="flex"
          onClick={() => (location.href = "/documents/createfile")}
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
          </svg>
          File
        </div>
      </ContextMenuItem>
      <ContextMenuItem>
        <div
          className="flex items-center"
          onClick={() => (location.href = "/documents/createfolder")}
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vector-effect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          Folder
        </div>
      </ContextMenuItem>
    </ContextMenu>
  </div>
);

export default PublicAssetsTable;
