import React from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetLettersQuery } from "../../slices/letterSlice";
import { useGetProfileQuery } from "../../slices/userSlice";
import Error from "../../components/Error";

const Letter: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: letters,
    isLoading: lettersLoading,
    isError: lettersError,
    refetch: refetchLetters,
  } = useGetLettersQuery();
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  if (lettersError || profileError) {
    return (
      <Error
        onReload={() => {
          refetchLetters();
          refetchProfile();
        }}
        errorText={t("fetchLettersError")}
      />
    );
  }

  if (lettersLoading || profileLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return <Content letters={letters || []} userEmail={profile?.email || ""} />;
};

export default Letter;
