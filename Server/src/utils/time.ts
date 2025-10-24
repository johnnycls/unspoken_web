export function addMinutes(m: number, date: Date = new Date()) {
  const copyDate = new Date(date);
  copyDate.setTime(copyDate.getTime() + m * 60 * 1000);
  return copyDate;
}

export function getDaysDiff(date1: Date, date2: Date) {
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

export function isTimeConflict(newDateRange: {startDate: Date, endDate: Date}, existingDateRanges: {startDate: Date, endDate: Date}[]): boolean {
  for (const existingDateRange of existingDateRanges) {
    if (
      (newDateRange.startDate >= existingDateRange.startDate && newDateRange.startDate < existingDateRange.endDate) ||
      (newDateRange.endDate > existingDateRange.startDate && newDateRange.endDate <= existingDateRange.endDate) ||
      (newDateRange.startDate <= existingDateRange.startDate && newDateRange.endDate >= existingDateRange.endDate)
    ) {
      return true; 
    }
  }
  return false; 
}