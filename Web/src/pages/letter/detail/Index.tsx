import React from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import Content from "./Content";
import { useGetLettersQuery } from "../../../slices/letterSlice";
import Error from "../../../components/Error";

const LetterDetail: React.FC = () => {
  const { t } = useTranslation();
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const { data: letters, isLoading, isError, refetch } = useGetLettersQuery();

  if (isError) {
    return <Error onReload={refetch} errorText={t("fetchLettersError")} />;
  }

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  const letterIndex = parseInt(index || "0", 10);
  const letter = letters?.[letterIndex];

  if (!letter) {
    navigate("/");
    return null;
  }

  return <Content letter={letter} />;
};

export default LetterDetail;
