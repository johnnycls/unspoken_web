export function isParsableJSON(str: string): boolean {
  if (typeof str !== "string") {
    return false;
  }
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function hasIntersection<T>(arr1: T[], arr2: T[]): boolean {
  const set = new Set(arr1);
  return arr2.some((item) => set.has(item));
}

export function getPreviewContent(
  content: string,
  maxLength: number = 50
): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
}
