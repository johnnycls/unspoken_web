import { apiSlice } from "./apiSlice";
import {
  validateEmail,
  validateLetterContent,
  validateObjectId,
} from "../utils/validation";

export type Letter = {
  fromGroupId: string;
  toEmail: string;
  alias: string;
  content: string;
  timestamp: Date;
};

const letterSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLetters: builder.query<Letter[], void>({
      query: () => ({
        url: "letter/",
      }),
      providesTags: ["Letter"],
    }),
    sendLetter: builder.mutation<
      {
        message: string;
        letterId: string;
      },
      {
        fromGroupId: string;
        toEmail: string;
        alias: string;
        content: string;
      }
    >({
      query: (letterData) => {
        // Validate group ID
        if (!validateObjectId(letterData.fromGroupId)) {
          throw new Error("Invalid group ID format");
        }

        // Validate email format
        if (!validateEmail(letterData.toEmail)) {
          throw new Error("Invalid email format");
        }

        // Validate content
        const contentValidation = validateLetterContent(letterData.content);
        if (!contentValidation.valid) {
          throw new Error(contentValidation.error);
        }

        return {
          url: "letter/",
          method: "POST",
          body: letterData,
        };
      },
      invalidatesTags: ["Letter"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetLettersQuery, useSendLetterMutation } = letterSlice;
