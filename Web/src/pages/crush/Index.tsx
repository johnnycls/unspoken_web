import React from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetCrushQuery } from "../../slices/crushSlice";
import Error from "../../components/Error";
import { useUserNames } from "../../hooks/useUserNames";

const Crush: React.FC = () => {
  const { t } = useTranslation();
  const { data: crush, isLoading, isError, refetch } = useGetCrushQuery();
  const { userNames, isLoading: isUserNamesLoading } = useUserNames(
    crush ? [crush.toEmail] : []
  );

  if (isLoading || isUserNamesLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (isError || crush === undefined) {
    return <Error onReload={refetch} errorText={t("fetchCrushesError")} />;
  }

  const userExist = crush !== null && crush.toEmail in userNames;

  return (
    <Content
      crush={crush}
      userExist={userExist}
      username={userExist ? userNames[crush.toEmail] : ""}
    />
  );
};

export default Crush;
