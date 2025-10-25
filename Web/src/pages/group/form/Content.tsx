import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "../../../components/AppBar";
import { Button } from "primereact/button";
import GroupInfoForm from "./GroupInfoForm";
import MemberList from "../MemberList";
import AddMemberInput from "./AddMemberInput";
import { Group } from "../../../slices/groupSlice";

interface Member {
  email: string;
  role: "creator" | "member" | "invited";
}

interface GroupFormContentProps {
  isEditMode: boolean;
  group?: Group;
  name: string;
  description: string;
  newEmail: string;
  allMembers: Member[];
  userNames: Record<string, string>;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onNewEmailChange: (email: string) => void;
  onAddEmail: () => void;
  onRemoveMember: (email: string) => void;
  onSubmit: () => void;
}

const GroupFormContent: React.FC<GroupFormContentProps> = ({
  isEditMode,
  group,
  name,
  description,
  newEmail,
  allMembers,
  userNames,
  onNameChange,
  onDescriptionChange,
  onNewEmailChange,
  onAddEmail,
  onRemoveMember,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (isEditMode && group) {
      navigate(`/groups/${group.id}`);
    } else {
      navigate("/groups");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <AppBar onBack={handleBack}>
        <h1 className="text-2xl">
          {isEditMode ? t("groups.edit") : t("groups.create")}
        </h1>
      </AppBar>

      <div className="w-full h-full flex flex-col overflow-y-auto p-4 gap-4">
        <GroupInfoForm
          name={name}
          description={description}
          onNameChange={onNameChange}
          onDescriptionChange={onDescriptionChange}
        />
        {/* 
        {isEditMode && group && (
          <MemberList
            members={allMembers.filter(
              (m) => m.role === "creator" || m.role === "member"
            )}
            userNames={userNames}
          />
        )}

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{t("groups.members")}</h3>

          <AddMemberInput
            value={newEmail}
            onChange={onNewEmailChange}
            onAdd={onAddEmail}
          />

          {invitedMembers.length > 0 && (
            <MemberList
              members={invitedMembers}
              userNames={userNames}
              showRemoveButtons
              onRemoveMember={onRemoveMember}
            />
          )}
        </div> */}

        <div className="mt-auto">
          <Button
            label={isEditMode ? t("common.save") : t("groups.create")}
            icon={isEditMode ? "pi pi-check" : "pi pi-plus"}
            className="w-full"
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupFormContent;
