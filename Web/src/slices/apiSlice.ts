import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "../config";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, { endpoint }) => {
      if (!headers.get("Authorization")) {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", token);
        }
      }
    },
  }),
  tagTypes: ["User", "Crush", "Letter", "Group"],
  reducerPath: "api",
  endpoints: (builder) => ({}),
});

export const {} = apiSlice;
