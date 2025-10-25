import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { confirmDialog } from "primereact/confirmdialog";
import AppBar from "../../../components/AppBar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import MemberList from "../MemberList";
import { Group } from "../../../slices/groupSlice";
import { Member } from "../utils/types";

interface GroupDetailContentProps {
  group: Group;
  userEmail: string;
  allMembers: Member[];
  userNames: { [key: string]: string };
  onAcceptInvitation: () => void;
  onDeclineInvitation: () => void;
  onLeaveGroup: () => void;
  onDeleteGroup: () => void;
}

const GroupDetailContent: React.FC<GroupDetailContentProps> = ({
  group,
  userEmail,
  allMembers,
  userNames,
  onAcceptInvitation,
  onDeclineInvitation,
  onLeaveGroup,
  onDeleteGroup,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isCreator = group.creatorEmail === userEmail;
  const isMember = group.memberEmails.includes(userEmail);
  const isInvited = group.invitedEmails.includes(userEmail);

  const handleAcceptInvitation = () => {
    onAcceptInvitation();
  };

  const handleDeclineInvitation = () => {
    confirmDialog({
      message: t("groups.declineInvitation") + "?",
      header: t("common.confirm"),
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDeclineInvitation();
      },
    });
  };

  const handleLeaveGroup = () => {
    confirmDialog({
      message: t("groups.leaveGroup") + "?",
      header: t("common.confirm"),
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onLeaveGroup();
      },
    });
  };

  const handleDeleteGroup = () => {
    confirmDialog({
      message: t("groups.deleteGroup") + "?",
      header: t("common.confirm"),
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        onDeleteGroup();
      },
    });
  };

  const handleEdit = () => {
    navigate(`/groups/${group.id}/edit`);
  };

  const handleBack = () => {
    navigate("/groups");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <AppBar onBack={handleBack}>
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl">{t("groups.detail")}</h1>
          {isCreator && <Button icon="pi pi-pencil" onClick={handleEdit} />}
        </div>
      </AppBar>

      <div className="w-full h-full flex flex-col overflow-y-auto p-4">
        <Card
          title={group.name}
          subTitle={group.description}
          pt={{ title: { className: "m-0!" }, body: { className: "gap-0!" } }}
        >
          <MemberList members={allMembers} userNames={userNames} />
        </Card>

        <div className="mt-auto">
          {isInvited && (
            <div className="flex gap-2">
              <Button
                label={t("groups.acceptInvitation")}
                icon="pi pi-check"
                className="flex-1"
                onClick={handleAcceptInvitation}
              />
              <Button
                label={t("groups.declineInvitation")}
                icon="pi pi-times"
                className="flex-1"
                severity="secondary"
                onClick={handleDeclineInvitation}
              />
            </div>
          )}

          {isMember && !isCreator && (
            <Button
              label={t("groups.leaveGroup")}
              icon="pi pi-sign-out"
              className="w-full"
              severity="danger"
              onClick={handleLeaveGroup}
            />
          )}

          {isCreator && (
            <Button
              label={t("groups.deleteGroup")}
              icon="pi pi-trash"
              className="w-full"
              severity="danger"
              onClick={handleDeleteGroup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailContent;
