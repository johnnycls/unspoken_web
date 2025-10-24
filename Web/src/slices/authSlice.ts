import { CredentialResponse } from "@react-oauth/google";
import { apiSlice } from "./apiSlice";

type tokenResponse = { token: string };

const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<tokenResponse, { credentials: CredentialResponse }>(
      {
        query: ({ credentials }) => ({
          url: "user/login/",
          method: "POST",
          body: { credentials },
          headers: { Authorization: "None" },
        }),
        transformResponse: (res: { token: string }) => {
          localStorage.setItem("token", res.token);
          return res;
        },
        invalidatesTags: ["User"],
      }
    ),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authSlice;
