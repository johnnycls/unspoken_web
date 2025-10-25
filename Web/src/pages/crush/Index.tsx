import React from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetCrushesQuery } from "../../slices/crushSlice";
import Error from "../../components/Error";

const Crush: React.FC = () => {
  const { t } = useTranslation();
  const { data: crushes, isLoading, isError, refetch } = useGetCrushesQuery();

  if (isError) {
    return <Error onReload={refetch} errorText={t("fetchCrushesError")} />;
  }

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return <Content crushes={crushes || []} />;
};

export default Crush;
