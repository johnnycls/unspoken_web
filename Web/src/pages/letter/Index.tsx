import React from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetLettersQuery } from "../../slices/letterSlice";
import Error from "../../components/Error";

const Letter: React.FC = () => {
  const { t } = useTranslation();
  const { data: letters, isLoading, isError, refetch } = useGetLettersQuery();

  if (isError) {
    return <Error onReload={refetch} errorText={t("fetchLettersError")} />;
  }

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return <Content letters={letters || []} />;
};

export default Letter;
