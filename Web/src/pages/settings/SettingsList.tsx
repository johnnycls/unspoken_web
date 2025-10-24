import React from "react";
import { useTranslation } from "react-i18next";
import { langs } from "../../assets/langs";

interface SettingsListProps {
  displayName?: string;
  language?: string;
  onDisplayNameClick: () => void;
  onLanguageClick: () => void;
}

const SettingsList: React.FC<SettingsListProps> = ({
  displayName,
  language,
  onDisplayNameClick,
  onLanguageClick,
}) => {
  const { t } = useTranslation();

  const getLangName = (code: string) => {
    const lang = langs.find((l) => l.code === code);
    return lang?.nativeName || code;
  };

  return (
    <div className="flex flex-col">
      <div
        className="flex justify-between items-center p-4 border-b cursor-pointer hover:bg-gray-50"
        onClick={onDisplayNameClick}
      >
        <span>{t("settings.displayName")}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{displayName || "-"}</span>
          <i className="pi pi-chevron-right text-gray-400"></i>
        </div>
      </div>

      <div
        className="flex justify-between items-center p-4 border-b cursor-pointer hover:bg-gray-50"
        onClick={onLanguageClick}
      >
        <span>{t("settings.language")}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {language ? getLangName(language) : "-"}
          </span>
          <i className="pi pi-chevron-right text-gray-400"></i>
        </div>
      </div>
    </div>
  );
};

export default SettingsList;
