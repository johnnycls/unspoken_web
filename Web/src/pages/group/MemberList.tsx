import React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "primereact/badge";
import MemberCard from "./MemberCard";
import { MAX_TOTAL_MEMBERS } from "../../config";
import { Member } from "./utils/types";

type MemberListProps = {
  members: Member[];
  userNames: { [key: string]: string };
  showRemoveButtons?: boolean;
  onRemoveMember?: (email: string, role: string) => void;
};

const MemberList: React.FC<MemberListProps> = ({
  members,
  userNames,
  showRemoveButtons = false,
  onRemoveMember,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t("groups.members")}</h3>
        <Badge
          value={t("groups.memberCount", {
            count: members.length,
            max: MAX_TOTAL_MEMBERS,
          })}
          severity={members.length > MAX_TOTAL_MEMBERS ? "danger" : "info"}
        />
      </div>

      <div className="flex flex-col">
        {members.map((member, index) => (
          <MemberCard
            key={index}
            email={member.email}
            role={member.role}
            displayName={userNames[member.email]}
            showRemoveButton={showRemoveButtons && member.role !== "creator"}
            onRemove={
              onRemoveMember
                ? () => onRemoveMember(member.email, member.role)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
