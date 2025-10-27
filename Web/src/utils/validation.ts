import {
  NAME_LENGTH_LIMIT,
  DESCRIPTION_LENGTH_LIMIT,
  MESSAGE_LENGTH_LIMIT,
  LETTER_LENGTH_LIMIT,
  MAX_TOTAL_MEMBERS,
} from "../config";

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates string length
 */
export const validateStringLength = (
  str: string,
  maxLength: number
): boolean => {
  return str.length <= maxLength;
};

/**
 * Validates that a string is not empty after trimming
 */
export const validateNonEmptyString = (str: string): boolean => {
  return str.trim() !== "";
};

/**
 * Validates an array of emails
 */
export const validateEmailArray = (
  emails: string[],
  maxCount: number
): { valid: boolean; error?: string } => {
  if (emails.length > maxCount) {
    return { valid: false, error: `Maximum ${maxCount} emails allowed` };
  }

  const invalidEmails = emails.filter((email) => !validateEmail(email));
  if (invalidEmails.length > 0) {
    return { valid: false, error: "Invalid email format detected" };
  }

  return { valid: true };
};

/**
 * Validates name field
 */
export const validateName = (
  name: string
): { valid: boolean; error?: string } => {
  if (!validateStringLength(name, NAME_LENGTH_LIMIT)) {
    return {
      valid: false,
      error: `Name must be ${NAME_LENGTH_LIMIT} characters or less`,
    };
  }
  return { valid: true };
};

/**
 * Validates description field
 */
export const validateDescription = (
  description: string
): { valid: boolean; error?: string } => {
  if (!validateStringLength(description, DESCRIPTION_LENGTH_LIMIT)) {
    return {
      valid: false,
      error: `Description must be ${DESCRIPTION_LENGTH_LIMIT} characters or less`,
    };
  }
  return { valid: true };
};

/**
 * Validates message field (for crushes)
 */
export const validateMessage = (
  message: string
): { valid: boolean; error?: string } => {
  if (!validateNonEmptyString(message)) {
    return { valid: false, error: "Message cannot be empty" };
  }
  if (!validateStringLength(message, MESSAGE_LENGTH_LIMIT)) {
    return {
      valid: false,
      error: `Message must be ${MESSAGE_LENGTH_LIMIT} characters or less`,
    };
  }
  return { valid: true };
};

/**
 * Validates letter content
 */
export const validateLetterContent = (
  content: string
): { valid: boolean; error?: string } => {
  if (!validateNonEmptyString(content)) {
    return { valid: false, error: "Content cannot be empty" };
  }
  if (!validateStringLength(content, LETTER_LENGTH_LIMIT)) {
    return {
      valid: false,
      error: `Content must be ${LETTER_LENGTH_LIMIT} characters or less`,
    };
  }
  return { valid: true };
};

/**
 * Validates if user can perform crush operations based on day of month
 */
export const canSubmitCrush = (): boolean => {
  const dayOfMonth = new Date().getDate();
  return dayOfMonth <= 14;
};

/**
 * Validates MongoDB ObjectId format
 */
export const validateObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validates invited emails for group (max 249 since creator is always included)
 */
export const validateInvitedEmails = (
  emails: string[]
): { valid: boolean; error?: string } => {
  return validateEmailArray(emails, MAX_TOTAL_MEMBERS - 1);
};

/**
 * Validates total group members + invited
 */
export const validateTotalGroupSize = (
  memberCount: number,
  invitedCount: number
): { valid: boolean; error?: string } => {
  const total = memberCount + invitedCount;
  if (total > MAX_TOTAL_MEMBERS) {
    return {
      valid: false,
      error: `Total members and invited cannot exceed ${MAX_TOTAL_MEMBERS}`,
    };
  }
  return { valid: true };
};
