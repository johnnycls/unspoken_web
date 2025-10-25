import React from "react";
import { useTranslation } from "react-i18next";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface AddMemberInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

const AddMemberInput: React.FC<AddMemberInputProps> = ({
  value,
  onChange,
  onAdd,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <InputText
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("groups.emailPlaceholder")}
        className="flex-1"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onAdd();
          }
        }}
      />
      <Button label={t("common.add")} icon="pi pi-plus" onClick={onAdd} />
    </div>
  );
};

export default AddMemberInput;
