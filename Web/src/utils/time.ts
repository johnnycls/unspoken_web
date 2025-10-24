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

export function isTimeConflict(
  newDateRange: { startDate: Date; endDate: Date },
  existingDateRanges: { startDate: Date; endDate: Date }[]
): boolean {
  for (const existingDateRange of existingDateRanges) {
    if (
      (newDateRange.startDate >= existingDateRange.startDate &&
        newDateRange.startDate < existingDateRange.endDate) ||
      (newDateRange.endDate > existingDateRange.startDate &&
        newDateRange.endDate <= existingDateRange.endDate) ||
      (newDateRange.startDate <= existingDateRange.startDate &&
        newDateRange.endDate >= existingDateRange.endDate)
    ) {
      return true;
    }
  }
  return false;
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
