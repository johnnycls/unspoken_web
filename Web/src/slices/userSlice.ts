import { langs } from "../assets/langs";
import { apiSlice } from "./apiSlice";
import i18next from "i18next";

export type profile = {
  email: string;
  name: string;
  lang: string;
};

const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<profile, void>({
      query: () => ({
        url: "user/",
      }),
      transformResponse: (response: profile) => {
        if (response.lang !== "") {
          i18next.changeLanguage(response.lang);
          return response;
        } else if (
          langs.find((lang) => lang.code === i18next.language) !== undefined
        ) {
          return { ...response, lang: i18next.language };
        } else {
          i18next.changeLanguage("zh");
          return { ...response, lang: "zh" };
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<
      { message: string },
      {
        name?: string;
        lang?: string;
      }
    >({
      query: (profileData) => ({
        url: "user/",
        method: "PATCH",
        body: profileData,
      }),
      async onQueryStarted(profileData, {}) {
        try {
          if (profileData.lang) {
            i18next.changeLanguage(profileData.lang);
          }
        } catch {}
      },
      invalidatesTags: ["User"],
    }),
    getUsersByEmails: builder.query<
      { [key: string]: string },
      { emails: string[] }
    >({
      query: (data) => ({
        url: "user/get-names",
        method: "POST",
        body: data,
      }),
      providesTags: ["Users"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersByEmailsQuery,
  useLazyGetUsersByEmailsQuery,
} = userSlice;
