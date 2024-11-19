export const formatDuration = (duration: string | null | undefined): string => {
  if (!duration) return "Not set";

  const hours = Math.floor(Number(duration));
  const minutes = Math.round((Number(duration) - hours) * 60);

  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  } else if (minutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    }`;
  }
};
