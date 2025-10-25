import React from "react";
import { useTranslation } from "react-i18next";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

interface GroupInfoFormProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

const GroupInfoForm: React.FC<GroupInfoFormProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-semibold">{t("groups.name")}</label>
        <InputText
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t("groups.namePlaceholder")}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">
          {t("groups.description")}
        </label>
        <InputTextarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={t("groups.descriptionPlaceholder")}
          className="w-full"
          rows={3}
          autoResize
        />
      </div>
    </div>
  );
};

export default GroupInfoForm;
