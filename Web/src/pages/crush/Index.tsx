import React from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetCrushQuery } from "../../slices/crushSlice";
import Error from "../../components/Error";

const Crush: React.FC = () => {
  const { t } = useTranslation();
  const { data: crush, isLoading, isError, refetch } = useGetCrushQuery();

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (isError || crush === undefined) {
    return <Error onReload={refetch} errorText={t("fetchCrushesError")} />;
  }

  return <Content crush={crush} />;
};

export default Crush;
