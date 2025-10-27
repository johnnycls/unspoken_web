import React from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetGroupsQuery } from "../../../slices/groupSlice";
import { useGetLettersQuery } from "../../../slices/letterSlice";
import Error from "../../../components/Error";
import { useGetProfileQuery } from "../../../slices/userSlice";

const NewLetter: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: groups,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
    refetch: refetchGroups,
  } = useGetGroupsQuery();
  const {
    data: letters,
    isLoading: isLoadingLetters,
    isError: isErrorLetters,
    refetch: refetchLetters,
  } = useGetLettersQuery();
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  if (isLoadingGroups || isLoadingLetters || isProfileLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (
    isErrorGroups ||
    isErrorLetters ||
    isProfileError ||
    !profile ||
    groups === undefined ||
    letters === undefined
  ) {
    return (
      <Error
        onReload={() => {
          refetchGroups();
          refetchLetters();
          refetchProfile();
        }}
        errorText={t("fetchDataError")}
      />
    );
  }

  return <Content groups={groups} letters={letters} profile={profile} />;
};

export default NewLetter;
