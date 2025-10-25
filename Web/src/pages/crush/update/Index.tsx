import React from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetCrushesQuery } from "../../../slices/crushSlice";
import Error from "../../../components/Error";
import { useNavigate } from "react-router";

const UpdateCrush: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: crushes, isLoading, isError, refetch } = useGetCrushesQuery();

  const now = new Date();
  const dayOfMonth = now.getDate();
  const isSubmissionPeriod = dayOfMonth <= 14;

  if (!isSubmissionPeriod) {
    navigate("/crush");
  }

  if (isError) {
    return <Error onReload={refetch} errorText={t("fetchCrushesError")} />;
  }

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return <Content crushes={crushes || []} />;
};

export default UpdateCrush;
