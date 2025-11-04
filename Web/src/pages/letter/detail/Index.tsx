import React from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import Content from "./Content";
import { useGetLettersQuery, Letter } from "../../../slices/letterSlice";
import Error from "../../../components/Error";
import { useGetGroupsQuery } from "../../../slices/groupSlice";
import { useGetProfileQuery } from "../../../slices/userSlice";

const LetterDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: letters, isLoading, isError, refetch } = useGetLettersQuery();
  const {
    data: groups,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
  } = useGetGroupsQuery();
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useGetProfileQuery();

  if (isLoading || isLoadingGroups || isLoadingProfile) {
    return <LoadingScreen isLoading={true} />;
  }

  if (
    isError ||
    isErrorGroups ||
    isErrorProfile ||
    letters === undefined ||
    id === undefined
  ) {
    return <Error onReload={refetch} errorText={t("fetchLettersError")} />;
  }

  const letter = letters?.find((l: Letter) => l.id === id);

  if (!letter || groups === undefined || profile === undefined) {
    return (
      <Error
        onReload={() => navigate("/")}
        errorText={t("fetchLettersError")}
      />
    );
  }

  return <Content letter={letter} groups={groups} userEmail={profile.email} />;
};

export default LetterDetail;
