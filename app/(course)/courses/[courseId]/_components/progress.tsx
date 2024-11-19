"use client";

import { useTheme } from "next-themes";
import { Line } from "rc-progress";
import React from "react";

interface ProgressProps {
  progress: number;
  ThemeColor: string;
  DarkThemeColor: string;
}

const Progress = ({progress, ThemeColor, DarkThemeColor}: ProgressProps) => {
  const { theme } = useTheme();
  const getThemeColor = () => {
    if (theme === "dark") {
      return DarkThemeColor;
    } else {
      return ThemeColor;
    }
  };

  return (
    <div>
      <Line
        // percent={each?.progress || 0}
        percent={progress}
        strokeWidth={3}
        strokeColor={getThemeColor()}
      />
      <div className="mt-2"
        style={{ color: getThemeColor() }}
      >
        {progress?.toString()?.split(".")[0]}% Complete
      </div>
    </div>
  );
};

export default Progress;
