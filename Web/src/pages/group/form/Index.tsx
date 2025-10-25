import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "../../../slices/groupSlice";
import {
  useGetProfileQuery,
  useGetUsersByEmailsQuery,
  useLazyGetUsersByEmailsQuery,
} from "../../../slices/userSlice";
import LoadingScreen from "../../../components/LoadingScreen";
import Error from "../../../components/Error";
import { Toast } from "primereact/toast";
import groupMembers from "../utils/groupMembers";
import {
  MAX_TOTAL_MEMBERS,
  NAME_LENGTH_LIMIT,
  DESCRIPTION_LENGTH_LIMIT,
} from "../../../config";
import GroupFormContent from "./Content";

const GroupForm: React.FC = () => {
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
    createGroup,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      isSuccess: isCreateSuccess,
    },
  ] = useCreateGroupMutation();

  const [
    updateGroup,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      isSuccess: isUpdateSuccess,
    },
  ] = useUpdateGroupMutation();

  const isEditMode = !!groupId;
  const group = groups?.find((g) => g.id === groupId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newUserNames, setNewUserNames] = useState<{ [email: string]: string }>(
    {}
  );

  const allOldEmails = [
    ...(group?.memberEmails || []),
    ...(group?.invitedEmails || []),
  ];
  const {
    data: oldUserNames,
    isError: fetchUserNamesError,
    refetch: refetchUserNames,
  } = useGetUsersByEmailsQuery(
    { emails: allOldEmails },
    { skip: allOldEmails.length === 0 }
  );
  const [fetchUserName, { isLoading: isNewUserNameLoading }] =
    useLazyGetUsersByEmailsQuery();

  const userNames = { ...oldUserNames, ...newUserNames };
  const allMembers = groupMembers({
    creatorEmail: creatorEmail,
    memberEmails: memberEmails,
    invitedEmails: invitedEmails,
  });

  useEffect(() => {
    if (isEditMode && group) {
      setName(group.name);
      setDescription(group.description);
      setCreatorEmail(group.creatorEmail);
      setMemberEmails(group.memberEmails);
      setInvitedEmails(group.invitedEmails);
    }
  }, [isEditMode, group]);

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      toast.current?.show({
        severity: "success",
        summary: isEditMode
          ? t("groups.updateSuccess")
          : t("groups.createSuccess"),
      });
      navigate("/groups");
    }
  }, [isCreateSuccess, isUpdateSuccess, isEditMode, navigate, t]);

  useEffect(() => {
    if (isCreateError) {
      toast.current?.show({
        severity: "error",
        summary: t("groups.createError"),
      });
    }
  }, [isCreateError, t]);

  useEffect(() => {
    if (isUpdateError) {
      toast.current?.show({
        severity: "error",
        summary: t("groups.updateError"),
      });
    }
  }, [isUpdateError, t]);

  const handleAddEmail = async () => {
    const trimmedEmail = newEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.emailRequired"),
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.invalidEmail"),
      });
      return;
    }

    const userEmail = profile?.email || "";
    if (trimmedEmail === userEmail) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.cannotInviteSelf"),
      });
      return;
    }

    const existingMembers = [...memberEmails, ...invitedEmails];

    if (existingMembers.includes(trimmedEmail)) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.emailAlreadyAdded"),
      });
      return;
    }

    if (existingMembers.length >= MAX_TOTAL_MEMBERS) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.maxMembersReached"),
      });
      return;
    }

    try {
      const payload = await fetchUserName(
        { emails: [trimmedEmail] },
        true
      ).unwrap();
      setNewUserNames((prev) => ({ ...prev, ...payload }));
      setInvitedEmails([...invitedEmails, trimmedEmail]);
      setNewEmail("");
      toast.current?.show({
        severity: "success",
        summary: t("groups.addMemberSuccess"),
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: t("groups.memberNotFound"),
      });
      return;
    }
  };

  const handleRemoveMember = (email: string) => {
    if (email === creatorEmail) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.cannotRemoveCreator"),
      });
    } else if (memberEmails.includes(email)) {
      setMemberEmails(memberEmails.filter((e) => e !== email));
    } else if (invitedEmails.includes(email)) {
      setInvitedEmails(invitedEmails.filter((e) => e !== email));
    }
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.nameRequired"),
      });
      return;
    }

    if (trimmedName.length > NAME_LENGTH_LIMIT) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.nameTooLong"),
      });
      return;
    }

    if (description.length > DESCRIPTION_LENGTH_LIMIT) {
      toast.current?.show({
        severity: "warn",
        summary: t("groups.descriptionTooLong"),
      });
      return;
    }

    if (isEditMode && group) {
      updateGroup({
        groupId: group.id,
        name: trimmedName,
        description: description.trim(),
        memberEmails,
        invitedEmails,
      });
    } else {
      createGroup({
        name: trimmedName,
        description: description.trim(),
        invitedEmails,
      });
    }
  };

  if (isGroupsError) {
    return <Error onReload={refetchGroups} errorText={t("fetchGroupsError")} />;
  }

  if (isProfileError) {
    return (
      <Error onReload={refetchProfile} errorText={t("fetchProfileError")} />
    );
  }

  if (fetchUserNamesError) {
    return (
      <Error onReload={refetchUserNames} errorText={t("fetchUserNamesError")} />
    );
  }

  if (isGroupsLoading || isProfileLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (isEditMode && !group) {
    return <Error onReload={refetchGroups} errorText={t("fetchGroupsError")} />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Toast ref={toast} />
      <LoadingScreen
        isLoading={isCreateLoading || isUpdateLoading || isNewUserNameLoading}
      />

      <GroupFormContent
        isEditMode={isEditMode}
        group={group}
        name={name}
        description={description}
        newEmail={newEmail}
        allMembers={allMembers}
        userNames={userNames}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onNewEmailChange={setNewEmail}
        onAddEmail={handleAddEmail}
        onRemoveMember={handleRemoveMember}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default GroupForm;
