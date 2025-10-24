export function getRandomSubarray<T>(arr: Array<T>, size: number): Array<T> {
  if (size < 0 || size > arr.length) {
    throw new Error(
      `Invalid size: ${size}. Must be between 0 and ${arr.length}`
    );
  }

  const shuffled = arr.slice(0);
  let i = arr.length;
  const min = i - size;

  while (i-- > min) {
    const index = Math.floor((i + 1) * Math.random());
    [shuffled[index], shuffled[i]] = [shuffled[i], shuffled[index]];
  }

  const result = shuffled.slice(min);
  return result;
}
