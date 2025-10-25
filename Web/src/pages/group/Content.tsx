import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import BottomTab from "../../components/BottomTab";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Group } from "../../slices/groupSlice";
import { profile } from "../../slices/userSlice";
import GroupListItem from "./GroupListItem";

const Content: React.FC<{ groups: Group[]; profile: profile }> = ({
  groups,
  profile,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<"joined" | "invited">("joined");

  const filterOptions = [
    { label: t("groups.joined"), value: "joined" },
    { label: t("groups.invited"), value: "invited" },
  ];

  const filteredGroups = groups.filter((group) => {
    if (filterType === "joined") {
      return profile?.email && group.memberEmails.includes(profile.email);
    } else {
      return profile?.email && group.invitedEmails.includes(profile.email);
    }
  });

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  const handleAddClick = () => {
    navigate("/groups/create");
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <AppBar>
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl">{t("groups.title")}</h1>
          <Button icon="pi pi-plus" className="p-0!" onClick={handleAddClick} />
        </div>
      </AppBar>

      <div className="w-full h-full flex flex-col p-4 gap-2 overflow-y-auto items-center">
        <SelectButton
          value={filterType}
          onChange={(e) => setFilterType(e.value)}
          options={filterOptions}
        />

        {filteredGroups.length === 0 ? (
          <div className="w-full text-center text-gray-500 pt-8">
            {filterType === "joined"
              ? t("groups.noGroups")
              : t("groups.noInvitations")}
          </div>
        ) : (
          filteredGroups.map((group) => (
            <GroupListItem
              key={group.id}
              group={group}
              onClick={handleGroupClick}
            />
          ))
        )}
      </div>

      <BottomTab activeIndex={2} />
    </div>
  );
};

export default Content;
