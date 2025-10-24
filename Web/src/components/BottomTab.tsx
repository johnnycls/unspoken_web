import React from "react";
import { useNavigate } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";

const BottomTab: React.FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const navigate = useNavigate();

  const items = [
    { label: "", icon: "pi pi-envelope", command: () => navigate("/") },
    { label: "", icon: "pi pi-heart", command: () => navigate("/crush") },
    { label: "", icon: "pi pi-users", command: () => navigate("/groups") },
    { label: "", icon: "pi pi-cog", command: () => navigate("/settings") },
  ];

  return (
    <div className="w-full flex mt-auto">
      <TabMenu
        className="w-full"
        pt={{
          menu: { className: "justify-between" },
          icon: { className: "!text-xl" },
        }}
        model={items}
        activeIndex={activeIndex}
      />
    </div>
  );
};

export default BottomTab;
