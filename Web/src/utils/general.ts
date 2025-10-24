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
