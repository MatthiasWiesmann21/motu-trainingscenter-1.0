export const formatDuration = (duration: string | null | undefined): string => {
  if (!duration) return "Not set";

  const totalMinutes = Number(duration);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

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