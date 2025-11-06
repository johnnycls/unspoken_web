import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "../../../slices/groupSlice";
import { useGetProfileQuery } from "../../../slices/userSlice";
import LoadingScreen from "../../../components/LoadingScreen";
import Error from "../../../components/Error";
import groupMembers from "../utils/groupMembers";
import {
  MAX_TOTAL_MEMBERS,
  NAME_LENGTH_LIMIT,
  DESCRIPTION_LENGTH_LIMIT,
} from "../../../config";
import GroupFormContent from "./Content";
import { validateEmail } from "../../../utils/validation";
import { useAppDispatch } from "../../../app/store";
import { showToast } from "../../../slices/toastSlice";
import { useUserNames } from "../../../hooks/useUserNames";

const GroupForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const dispatch = useAppDispatch();

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
  const [newEmail, setNewEmail] = useState<string>("");

  const allMembers = groupMembers({
    creatorEmail: creatorEmail,
    memberEmails: memberEmails,
    invitedEmails: invitedEmails,
  });

  const {
    userNames,
    isLoading: isUserNamesLoading,
    isError: fetchUserNamesError,
    lazyFetch: fetchUserName,
  } = useUserNames(allMembers.map((m) => m.email));

  useEffect(() => {
    if (isEditMode && group) {
      setName(group.name);
      setDescription(group.description);
      setCreatorEmail(group.creatorEmail);
      setMemberEmails(group.memberEmails);
      setInvitedEmails(group.invitedEmails);
    } else if (!isEditMode && profile) {
      setName("");
      setDescription("");
      setCreatorEmail(profile.email);
      setMemberEmails([profile.email]);
      setInvitedEmails([]);
    }
  }, [isEditMode, group, profile]);

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      dispatch(
        showToast({
          severity: "success",
          summary: isEditMode
            ? t("updateGroupSuccess")
            : t("createGroupSuccess"),
        })
      );
      navigate("/groups");
    }
  }, [isCreateSuccess, isUpdateSuccess, isEditMode, navigate, t, dispatch]);

  useEffect(() => {
    if (isCreateError) {
      dispatch(
        showToast({
          severity: "error",
          summary: t("createGroupError"),
        })
      );
    }
  }, [isCreateError, t, dispatch]);

  useEffect(() => {
    if (isUpdateError) {
      dispatch(
        showToast({
          severity: "error",
          summary: t("updateGroupError"),
        })
      );
    }
  }, [isUpdateError, t, dispatch]);

  const handleAddEmail = async () => {
    const trimmedEmail = newEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("groups.emailRequired"),
        })
      );
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("groups.invalidEmail"),
        })
      );
      return;
    }

    const userEmail = profile?.email || "";
    if (trimmedEmail === userEmail) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("groups.cannotInviteSelf"),
        })
      );
      return;
    }

    const existingMembers = [...memberEmails, ...invitedEmails];

    if (existingMembers.includes(trimmedEmail)) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("memberAlreadyInGroup"),
        })
      );
      return;
    }

    if (existingMembers.length >= MAX_TOTAL_MEMBERS) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("groups.maxMembersReached"),
        })
      );
      return;
    }

    try {
      const payload = await fetchUserName([trimmedEmail]);
      if (!payload || !(trimmedEmail in payload)) {
        dispatch(
          showToast({
            severity: "error",
            summary: t("memberNotFound"),
          })
        );
        return;
      }

      setInvitedEmails([...invitedEmails, trimmedEmail]);
      setNewEmail("");
      dispatch(
        showToast({
          severity: "success",
          summary: t("groups.addMemberSuccess"),
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          severity: "error",
          summary: t("memberNotFound"),
        })
      );
      return;
    }
  };

  const handleRemoveMember = (email: string) => {
    if (email === creatorEmail) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("groups.cannotRemoveCreator"),
        })
      );
    } else if (memberEmails.includes(email)) {
      setMemberEmails(memberEmails.filter((e) => e !== email));
    } else if (invitedEmails.includes(email)) {
      setInvitedEmails(invitedEmails.filter((e) => e !== email));
    }
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("groups.nameRequired"),
        })
      );
      return;
    }

    if (trimmedName.length > NAME_LENGTH_LIMIT) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("groups.nameTooLong"),
        })
      );
      return;
    }

    if (description.length > DESCRIPTION_LENGTH_LIMIT) {
      dispatch(
        showToast({
          severity: "warn",
          summary: t("groups.descriptionTooLong"),
        })
      );
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

  if (isGroupsLoading || isProfileLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (isEditMode && !group) {
    return <Error onReload={refetchGroups} errorText={t("fetchGroupsError")} />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <LoadingScreen
        isLoading={isCreateLoading || isUpdateLoading || isUserNamesLoading}
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
