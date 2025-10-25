import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const AppBar: React.FC<{ children?: React.ReactNode; onBack?: () => void }> = ({
  children,
  onBack,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full p-3 flex items-center"
      style={{
        backgroundColor: "var(--primary-color)",
        color: "var(--primary-color-text)",
      }}
    >
      {onBack && (
        <Button
          icon="pi pi-arrow-left"
          className="p-0!"
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              navigate("/");
            }
          }}
        />
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};
export default AppBar;
