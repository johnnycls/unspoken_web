import { apiSlice } from "./apiSlice";
import {
  validateEmail,
  validateMessage,
  canSubmitCrush,
} from "../utils/validation";

export type Crush = {
  toEmail: string;
  message: string;
  month: string;
  responseMessage: string;
};

const crushSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCrush: builder.query<Crush | null, void>({
      query: () => ({
        url: "crush/",
      }),
      providesTags: ["Crush"],
    }),
    createOrUpdateCrush: builder.mutation<
      {
        message: string;
      },
      {
        toEmail: string;
        message: string;
      }
    >({
      query: (crushData) => {
        // Check if within submission period (days 1-14)
        if (!canSubmitCrush()) {
          throw new Error(
            "Crush submissions are only allowed from day 1-14 of each month"
          );
        }

        // Validate email format
        if (!validateEmail(crushData.toEmail)) {
          throw new Error("Invalid email format");
        }

        // Validate message
        const messageValidation = validateMessage(crushData.message);
        if (!messageValidation.valid) {
          throw new Error(messageValidation.error);
        }

        return {
          url: "crush/",
          method: "POST",
          body: crushData,
        };
      },
      invalidatesTags: ["Crush"],
    }),
    deleteCrush: builder.mutation<{}, void>({
      query: () => {
        // Check if within submission period (days 1-14)
        if (!canSubmitCrush()) {
          throw new Error(
            "Crush can only be deleted from day 1-14 of each month"
          );
        }

        return {
          url: "crush/",
          method: "DELETE",
        };
      },
      invalidatesTags: ["Crush"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCrushQuery,
  useCreateOrUpdateCrushMutation,
  useDeleteCrushMutation,
} = crushSlice;
