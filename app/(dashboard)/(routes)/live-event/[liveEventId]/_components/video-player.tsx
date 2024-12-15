"use client";

import UniversalPlayer from "@/pages/components/universalPlayer";
import Timer from "./timer";
import { useEffect, useState } from "react";
import moment from "moment";

interface VideoPlayerProps {
  playbackId?: string;
  videoUrl: string;
  startDateTime: any;
  endDateTime: any;
}

const calculateTimeRemaining = (date: any) => {
  // Parse the input date
  const currentDate = moment();
  const targetDate = moment(date);

  // Calculate the difference
  const difference = moment.duration(targetDate.diff(currentDate));

  // Extract components
  const days = difference.days();
  const hours = difference.hours();
  const minutes = difference.minutes();
  const seconds = difference.seconds();

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

// Test the function
const remainingTime = calculateTimeRemaining("2024-03-30T12:00:00Z");

export const VideoPlayer = ({
  videoUrl,
  startDateTime,
  endDateTime,
}: VideoPlayerProps) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 30,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  const videoStyles = {
    borderRadius: "12px", // Rounded corners
    overflow: "hidden", // Ensures the content respects the rounded corners
  };

  useEffect(() => {
    if (!startDateTime) return;
    const timerInterval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(startDateTime));

      if (
        timeRemaining?.days <= 0 &&
        timeRemaining?.hours <= 0 &&
        timeRemaining?.minutes <= 0 &&
        timeRemaining?.seconds <= 0
      )
        clearInterval(timerInterval); // Stop the timer
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [startDateTime]);

  if (!videoUrl) {
    console.error("URL is not provided!");
    return null;
  }

  return (
    <div className="relative aspect-video text-white">
      {(!(
        timeRemaining?.days <= 0 &&
        timeRemaining?.hours <= 0 &&
        timeRemaining?.minutes <= 0 &&
        timeRemaining?.seconds <= 0
      ) ||
        new Date(endDateTime) < new Date()) && (
        <Timer timeRemaining={timeRemaining} endDateTime={endDateTime} />
      )}
      <UniversalPlayer url={videoUrl} style={videoStyles} />
    </div>
  );
};
