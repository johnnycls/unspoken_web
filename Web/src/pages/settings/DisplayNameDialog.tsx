import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { NAME_LENGTH_LIMIT } from "../../config";

interface DisplayNameDialogProps {
  visible: boolean;
  currentName: string;
  onHide: () => void;
  onSave: (name: string) => void;
}

const DisplayNameDialog: React.FC<DisplayNameDialogProps> = ({
  visible,
  currentName,
  onHide,
  onSave,
}) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(currentName);

  useEffect(() => {
    setDisplayName(currentName);
  }, [currentName, visible]);

  const handleSave = () => {
    if (displayName.trim() !== "") {
      onSave(displayName.trim());
    }
  };

  const handleCancel = () => {
    setDisplayName(currentName);
    onHide();
  };

  return (
    <Dialog
      header={t("settings.displayName")}
      visible={visible}
      onHide={onHide}
      style={{ width: "90vw", maxWidth: "400px" }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="displayName" className="text-sm">
            {t("settings.displayNameLabel")}
          </label>
          <InputText
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t("settings.displayNamePlaceholder")}
            maxLength={NAME_LENGTH_LIMIT}
          />
        </div>

        <div className="flex gap-2">
          <Button
            label={t("common.cancel")}
            severity="secondary"
            className="flex-1"
            onClick={handleCancel}
          />
          <Button
            label={t("common.save")}
            className="flex-1"
            disabled={displayName.trim() === "" || displayName === currentName}
            onClick={handleSave}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default DisplayNameDialog;
