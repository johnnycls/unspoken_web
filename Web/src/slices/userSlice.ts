import { langs } from "../assets/langs";
import { apiSlice } from "./apiSlice";
import i18next from "i18next";

export type profile = {
  email: string;
  name: string;
  lang: string;
};

type profileResponse = profile;

type updateProfileRequest = {
  name?: string;
  lang?: string;
};

const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<profileResponse, void>({
      query: () => ({
        url: "user/",
      }),
      transformResponse: (response: profileResponse) => {
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
    updateProfile: builder.mutation<{ message: string }, updateProfileRequest>({
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
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userSlice;
