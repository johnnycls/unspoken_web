import React from "react";
import { useTranslation } from "react-i18next";
import { langs } from "../../assets/langs";

interface SettingsListProps {
  email?: string;
  displayName?: string;
  language?: string;
  onDisplayNameClick: () => void;
  onLanguageClick: () => void;
}

const SettingsList: React.FC<SettingsListProps> = ({
  email,
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
      <div className="flex justify-between items-center gap-4 p-4 border-b">
        <span className="flex-shrink-0">{t("settings.email")}</span>
        <span className="text-gray-600 truncate text-right">
          {email || "-"}
        </span>
      </div>

      <div
        className="flex justify-between items-center gap-4 p-4 border-b cursor-pointer"
        onClick={onDisplayNameClick}
      >
        <span className="flex-shrink-0">{t("settings.displayName")}</span>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-gray-600 truncate">{displayName || "-"}</span>
          <i className="pi pi-chevron-right text-gray-400 flex-shrink-0"></i>
        </div>
      </div>

      <div
        className="flex justify-between items-center gap-4 p-4 border-b cursor-pointer"
        onClick={onLanguageClick}
      >
        <span className="flex-shrink-0">{t("settings.language")}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 truncate">
            {language ? getLangName(language) : "-"}
          </span>
          <i className="pi pi-chevron-right text-gray-400 flex-shrink-0"></i>
        </div>
      </div>
    </div>
  );
};

export default SettingsList;
