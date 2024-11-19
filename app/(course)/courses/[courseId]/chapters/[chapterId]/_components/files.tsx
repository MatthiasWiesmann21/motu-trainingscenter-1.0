import { Download } from "lucide-react";
import React from "react";

const arr = ["EXEL", "WORD", "PDF"];

const Files = () => (
  <div className="mt-5 py-4 pl-4">
    <div className="text-[18px] font-bold">Download Files</div>
    <div className="mt-4 flex text-gray-500">
      {arr?.map((each, index) => (
        <div
          key={index}
          className="my-2 mr-3 flex items-center rounded-[20px] border border-2 border-[red] p-2 px-5"
        >
          {each}
          <Download fill={"#ffffff00"} className="mb-1 ml-2" size={20} />
        </div>
      ))}
    </div>
  </div>
);

export default Files;
