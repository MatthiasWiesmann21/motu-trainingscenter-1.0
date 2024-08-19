"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, HomeIcon } from "lucide-react";

type Params = {
  id: string;
  action: string;
};

const PathMaker = () => {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const encodedObj = useParams()?.id as string;

  // Initialize id and action with default values
  let id: string | string[];
  let action: string | undefined;

  if (uuidPattern.test((useParams()?.id as string) ?? "")) {
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
  const [slug, setSlug] = useState([] as any);

  let lastPath = "";

  const getChildToParent = async () => {
    const response = await axios.get(`/api/documents/getparents?id=${id}`);
    return response.data.data;
  };

  useEffect(() => {
    extractFolders();
  }, []);

  const extractFolders = async () => {
    const path = await getChildToParent();
    setSlug(path);
  };

  return (
    <div className="flex">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4 p-2 pt-5">
          {slug
            .slice()
            .reverse()
            .map((item: any, index: number) => {
              lastPath += item + "/";
              if (index == 0) {
                return (
                  <li key={index}>
                    <div>
                      <a
                        href={`/documents`}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <HomeIcon size={20} />
                        <span className="sr-only">Home</span>
                      </a>
                    </div>
                  </li>
                );
              }
              return (
                <li key={index}>
                  <div className="flex items-center">
                    <ChevronRight className="text-gray-400" size={20} />
                    <a
                      href={`/documents/${item.id}`}
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {item.name}
                    </a>
                  </div>
                </li>
              );
            })}
        </ol>
      </nav>
    </div>
  );
};
export default PathMaker;
