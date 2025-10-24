import { apiSlice } from "./apiSlice";

export type Letter = {
  fromGroupId: string;
  toEmail: string;
  alias: string;
  content: string;
  timestamp: Date;
};

type SendLetterRequest = {
  fromGroupId: string;
  toEmail: string;
  alias: string;
  content: string;
};

type SendLetterResponse = {
  message: string;
  letterId: string;
};

const letterSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLetters: builder.query<Letter[], void>({
      query: () => ({
        url: "letter/",
      }),
      providesTags: ["Letter"],
    }),
    sendLetter: builder.mutation<SendLetterResponse, SendLetterRequest>({
      query: (letterData) => ({
        url: "letter/",
        method: "POST",
        body: letterData,
      }),
      invalidatesTags: ["Letter"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetLettersQuery, useSendLetterMutation } = letterSlice;
