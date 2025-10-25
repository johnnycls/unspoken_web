import React from "react";
import LoadingScreen from "../../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import Content from "./Content";
import { useGetGroupsQuery } from "../../slices/groupSlice";
import Error from "../../components/Error";
import { useGetProfileQuery } from "../../slices/userSlice";

const Groups: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: groups,
    isLoading: isGroupsLoading,
    isError: isGroupsError,
    refetch: refetchGroups,
  } = useGetGroupsQuery();

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  if (isGroupsError) {
    return <Error onReload={refetchGroups} errorText={t("fetchGroupsError")} />;
  }

  if (isProfileError) {
    return (
      <Error onReload={refetchProfile} errorText={t("fetchProfileError")} />
    );
  }

  if (isGroupsLoading || isProfileLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return profile && <Content groups={groups || []} profile={profile} />;
};

export default Groups;
