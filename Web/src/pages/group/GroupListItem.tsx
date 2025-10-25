import React from "react";
import { Group } from "../../slices/groupSlice";
import { Card } from "primereact/card";

type GroupListItemProps = {
  group: Group;
  onClick: (groupId: string) => void;
};

const GroupListItem: React.FC<GroupListItemProps> = ({ group, onClick }) => {
  return (
    <Card
      className="w-full cursor-pointer"
      onClick={() => onClick(group.id)}
      pt={{ body: { className: "p-4!" } }}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg">{group.name}</h3>

        <div className="text-gray-500 text-sm flex gap-1 items-center">
          <i className="pi pi-users" />
          {group.memberEmails.length}
        </div>
      </div>
      {group.description && (
        <p className="text-gray-600 text-sm">{group.description}</p>
      )}
    </Card>
  );
};

export default GroupListItem;
