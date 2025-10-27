export const addDays = (
  days: number,
  date: Date = new Date(),
  isNoon = true
): Date => {
  const copyDate = new Date(date);
  copyDate.setDate(copyDate.getDate() + days);
  if (isNoon) {
    copyDate.setHours(0);
    copyDate.setMinutes(0);
    copyDate.setSeconds(0);
    copyDate.setMilliseconds(0);
  }
  return copyDate;
};

export const getCurrentMonth = (date: Date = new Date()): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

export function sortByDate<T>(arr: Array<T>, key: keyof T, asc = true) {
  const cloned = Array.from(arr);
  return cloned.sort((a, b) => {
    const aDate = new Date(a[key] as string);
    const bDate = new Date(b[key] as string);
    return asc
      ? aDate.getTime() - bDate.getTime()
      : bDate.getTime() - aDate.getTime();
  });
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.ceil(
    Math.abs((date1.getTime() - date2.getTime()) / oneDay)
  );
  return diffDays;
}

export function displayDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDateTime = `${day}/${month}/${year}`;
  return formattedDateTime;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return displayDate(date);
  }
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function formatDate(timestamp: Date): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function formatUTCTime(date: Date = new Date()): string {
  const utcHours = String(date.getUTCHours()).padStart(2, "0");
  const utcMinutes = String(date.getUTCMinutes()).padStart(2, "0");
  const utcDate = date.getUTCDate();
  const utcMonth = date.getUTCMonth() + 1;
  const utcYear = date.getUTCFullYear();
  return `${utcYear}/${String(utcMonth).padStart(2, "0")}/${String(
    utcDate
  ).padStart(2, "0")} ${utcHours}:${utcMinutes} UTC`;
}
