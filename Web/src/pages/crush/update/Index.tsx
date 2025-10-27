import React from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetCrushQuery } from "../../../slices/crushSlice";
import Error from "../../../components/Error";
import { useNavigate } from "react-router";

const UpdateCrush: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: crush, isLoading, isError, refetch } = useGetCrushQuery();

  const now = new Date();
  const dayOfMonth = now.getDate();
  const isSubmissionPeriod = dayOfMonth <= 14;

  if (!isSubmissionPeriod) {
    navigate("/crush");
  }

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (isError || crush === undefined) {
    return <Error onReload={refetch} errorText={t("fetchCrushesError")} />;
  }

  return <Content crush={crush} />;
};

export default UpdateCrush;
