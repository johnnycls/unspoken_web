import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

type MemberCardProps = {
  email: string;
  role: "creator" | "member" | "invited";
  displayName?: string;
  showRemoveButton?: boolean;
  onRemove?: () => void;
};

const MemberCard: React.FC<MemberCardProps> = ({
  email,
  role,
  displayName,
  showRemoveButton = false,
  onRemove,
}) => {
  const { t } = useTranslation();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "creator":
        return t("groups.roleCreator");
      case "member":
        return t("groups.roleMember");
      case "invited":
        return t("groups.roleInvited");
      default:
        return role;
    }
  };

  return (
    <>
      <Divider />
      <div className="flex items-center justify-between py-1">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{displayName}</div>
          <div className="text-sm text-gray-500 truncate">{email}</div>
        </div>

        <div className="flex flex-col justify-center">
          {showRemoveButton && onRemove && (
            <Button
              icon="pi pi-minus"
              text
              severity="danger"
              onClick={onRemove}
            />
          )}
          <div className="text-sm text-gray-600">{getRoleLabel(role)}</div>
        </div>
      </div>
    </>
  );
};

export default MemberCard;
