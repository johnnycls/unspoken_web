import React from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import Content from "./Content";
import { useGetLettersQuery } from "../../../slices/letterSlice";
import Error from "../../../components/Error";
import { useGetGroupsQuery } from "../../../slices/groupSlice";

const LetterDetail: React.FC = () => {
  const { t } = useTranslation();
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const { data: letters, isLoading, isError, refetch } = useGetLettersQuery();
  const {
    data: groups,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
  } = useGetGroupsQuery();

  if (isLoading || isLoadingGroups) {
    return <LoadingScreen isLoading={true} />;
  }

  if (
    isError ||
    isErrorGroups ||
    letters === undefined ||
    index === undefined
  ) {
    return <Error onReload={refetch} errorText={t("fetchLettersError")} />;
  }

  const letterIndex = parseInt(index);
  const letter = letters?.[letterIndex];

  if (!letter || groups === undefined) {
    return (
      <Error
        onReload={() => navigate("/")}
        errorText={t("fetchLettersError")}
      />
    );
  }

  return <Content letter={letter} groups={groups} />;
};

export default LetterDetail;
