import type { Response } from "express";
import mongoose from "mongoose";

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

export function handleError(error: unknown, res: Response): void {
  console.error(JSON.stringify(error));
  res
    .status(500)
    .json({ message: "Internal server error", error: JSON.stringify(error) });
}

export function validateRequiredField(
  fieldValue: any,
  fieldName: string,
  res: Response
): boolean {
  if (!fieldValue) {
    res.status(400).json({ message: `${fieldName} is required` });
    return false;
  }
  return true;
}

export function validateStringLength(
  str: string,
  maxLength: number,
  fieldName: string,
  res: Response
): boolean {
  if (str && str.length > maxLength) {
    res.status(400).json({ message: `${fieldName} is too long` });
    return false;
  }
  return true;
}

export function validateNonEmptyString(
  str: string,
  fieldName: string,
  res: Response
): boolean {
  if (!str || str.trim() === "") {
    res.status(400).json({ message: `${fieldName} cannot be empty` });
    return false;
  }
  return true;
}

export function validateEmail(
  email: string,
  fieldName: string,
  res: Response
): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ message: `${fieldName} must be a valid email` });
    return false;
  }
  return true;
}

export function validateObjectId(
  id: string,
  fieldName: string,
  res: Response
): boolean {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: `${fieldName} is not valid` });
    return false;
  }
  return true;
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

export function removeDuplicates(arr: string[]): string[] {
  return [...new Set(arr)];
}
