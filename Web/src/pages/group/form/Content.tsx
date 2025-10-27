import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "../../../components/AppBar";
import { Button } from "primereact/button";
import GroupInfoForm from "./GroupInfoForm";
import MemberList from "../MemberList";
import AddMemberInput from "./AddMemberInput";
import { Group } from "../../../slices/groupSlice";
import { Card } from "primereact/card";

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

      <div className="w-full h-full flex overflow-y-auto p-4 justify-center items-center">
        <Card
          className="w-full max-h-full"
          pt={{
            content: {
              className: "w-full flex flex-col gap-4",
            },
            root: { className: "overflow-y-auto" },
          }}
        >
          <GroupInfoForm
            name={name}
            description={description}
            onNameChange={onNameChange}
            onDescriptionChange={onDescriptionChange}
          />
          <div>
            <MemberList
              members={allMembers}
              userNames={userNames}
              showRemoveButtons={isEditMode}
              onRemoveMember={onRemoveMember}
            />
            <AddMemberInput
              value={newEmail}
              onChange={onNewEmailChange}
              onAdd={onAddEmail}
            />
          </div>

          <Button
            label={isEditMode ? t("common.save") : t("groups.create")}
            icon={isEditMode ? "pi pi-check" : "pi pi-plus"}
            className="w-full"
            onClick={onSubmit}
          />
        </Card>
      </div>
    </div>
  );
};

export default GroupFormContent;
