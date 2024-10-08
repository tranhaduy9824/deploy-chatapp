import moment from "moment";

export const formatCallDuration = (seconds: number | null | undefined) => {
  const duration = moment.duration(seconds, "seconds");
  const hours = duration.hours();
  const minutes = duration.minutes();
  const secs = duration.seconds();

  return `${hours > 0 ? `${hours}h ` : ""}${
    minutes > 0 ? `${minutes}m ` : ""
  }${secs}s`;
};

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${Math.floor(sizeInBytes / 1024)} KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${Math.floor(sizeInBytes / (1024 * 1024))} MB`;
  } else {
    return `${Math.floor(sizeInBytes / (1024 * 1024 * 1024))} GB`;
  }
};
