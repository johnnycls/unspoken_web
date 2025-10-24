import { apiSlice } from "./apiSlice";

export type Crush = {
  toEmail: string;
  message: string;
  month: string;
  responseMessage: string;
};

type CreateCrushRequest = {
  toEmail: string;
  message: string;
};

type CreateCrushResponse = {
  message: string;
};

const crushSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCrushes: builder.query<Crush[], void>({
      query: () => ({
        url: "crush/",
      }),
      providesTags: ["Crush"],
    }),
    createOrUpdateCrush: builder.mutation<
      CreateCrushResponse,
      CreateCrushRequest
    >({
      query: (crushData) => ({
        url: "crush/",
        method: "POST",
        body: crushData,
      }),
      invalidatesTags: ["Crush"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCrushesQuery, useCreateOrUpdateCrushMutation } =
  crushSlice;
