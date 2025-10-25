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

export const getCurrentMonth = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};
