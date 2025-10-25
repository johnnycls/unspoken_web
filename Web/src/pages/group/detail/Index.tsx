import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetGroupsQuery,
  useRespondToInvitationMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
} from "../../../slices/groupSlice";
import {
  useGetProfileQuery,
  useGetUsersByEmailsQuery,
} from "../../../slices/userSlice";
import LoadingScreen from "../../../components/LoadingScreen";
import Error from "../../../components/Error";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import groupMembers from "../utils/groupMembers";
import GroupDetailContent from "./Content";

const GroupDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const toast = useRef<Toast>(null);

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

  const [
    respondToInvitation,
    {
      isLoading: isRespondLoading,
      isError: isRespondError,
      isSuccess: isRespondSuccess,
    },
  ] = useRespondToInvitationMutation();

  const [
    leaveGroup,
    {
      isLoading: isLeaveLoading,
      isError: isLeaveError,
      isSuccess: isLeaveSuccess,
    },
  ] = useLeaveGroupMutation();

  const [
    deleteGroup,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      isSuccess: isDeleteSuccess,
    },
  ] = useDeleteGroupMutation();

  useEffect(() => {
    if (isRespondSuccess) {
      toast.current?.show({
        severity: "success",
        summary: t("updateInvitationSuccess"),
      });
      navigate("/groups");
    }
  }, [isRespondSuccess, navigate]);

  useEffect(() => {
    if (isRespondError) {
      toast.current?.show({
        severity: "error",
        summary: t("updateInvitationError"),
      });
    }
  }, [isRespondError, t]);

  useEffect(() => {
    if (isLeaveSuccess) {
      toast.current?.show({
        severity: "success",
        summary: t("leaveGroupSuccess"),
      });
      navigate("/groups");
    }
  }, [isLeaveSuccess, navigate, t]);

  useEffect(() => {
    if (isLeaveError) {
      toast.current?.show({
        severity: "error",
        summary: t("leaveGroupError"),
      });
    }
  }, [isLeaveError, t]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.current?.show({
        severity: "success",
        summary: t("deleteGroupSuccess"),
      });
      navigate("/groups");
    }
  }, [isDeleteSuccess, navigate, t]);

  useEffect(() => {
    if (isDeleteError) {
      toast.current?.show({
        severity: "error",
        summary: t("deleteGroupError"),
      });
    }
  }, [isDeleteError, t]);

  const group = groups?.find((g) => g.id === groupId);

  const allMembers = groupMembers({
    creatorEmail: group?.creatorEmail || "",
    memberEmails: group?.memberEmails || [],
    invitedEmails: group?.invitedEmails || [],
  });

  const allEmails = allMembers.map((m) => m.email);
  const {
    data: userNames,
    isError: isUserNamesError,
    refetch: refetchUserNames,
  } = useGetUsersByEmailsQuery(
    { emails: allEmails },
    { skip: allEmails.length === 0 }
  );

  if (isGroupsError) {
    return <Error onReload={refetchGroups} errorText={t("fetchGroupsError")} />;
  }

  if (isProfileError) {
    return (
      <Error onReload={refetchProfile} errorText={t("fetchProfileError")} />
    );
  }

  if (isUserNamesError) {
    return (
      <Error onReload={refetchUserNames} errorText={t("fetchUserNamesError")} />
    );
  }

  if (isGroupsLoading || isProfileLoading || !group) {
    return <LoadingScreen isLoading={true} />;
  }

  const userEmail = profile?.email || "";

  const handleAcceptInvitation = () => {
    respondToInvitation({ id: group.id, isAccept: true });
  };

  const handleDeclineInvitation = () => {
    respondToInvitation({ id: group.id, isAccept: false });
  };

  const handleLeaveGroup = () => {
    leaveGroup({ groupId: group.id });
  };

  const handleDeleteGroup = () => {
    deleteGroup({ groupId: group.id });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Toast ref={toast} />
      <ConfirmDialog />
      <LoadingScreen
        isLoading={isRespondLoading || isLeaveLoading || isDeleteLoading}
      />

      <GroupDetailContent
        group={group}
        userEmail={userEmail}
        allMembers={allMembers}
        userNames={userNames || {}}
        onAcceptInvitation={handleAcceptInvitation}
        onDeclineInvitation={handleDeclineInvitation}
        onLeaveGroup={handleLeaveGroup}
        onDeleteGroup={handleDeleteGroup}
      />
    </div>
  );
};

export default GroupDetail;
