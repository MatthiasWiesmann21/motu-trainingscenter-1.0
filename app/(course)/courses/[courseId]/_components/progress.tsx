"use client";

import { Line } from "rc-progress";
import React from "react";

const Progress = ({ progress }: any) => {
  return (
    <div>
      <Line
        // percent={each?.progress || 0}
        percent={progress}
        strokeWidth={3}
        strokeColor="#EA2088"
      />
      <div className="mt-2 text-[#EA2088]">
        {progress?.toString()?.split(".")[0]}% Complete
      </div>
    </div>
  );
};

export default Progress;
