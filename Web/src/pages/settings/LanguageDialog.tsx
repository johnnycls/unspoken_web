import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { langs } from "../../assets/langs";
import i18next from "i18next";

interface LanguageDialogProps {
  visible: boolean;
  currentLang: string;
  onHide: () => void;
  onSave: (lang: string) => void;
}

const LanguageDialog: React.FC<LanguageDialogProps> = ({
  visible,
  currentLang,
  onHide,
  onSave,
}) => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(currentLang);

  useEffect(() => {
    setSelectedLang(currentLang);
  }, [currentLang, visible]);

  const handleSave = () => {
    if (selectedLang !== "") {
      i18next.changeLanguage(selectedLang);
      onSave(selectedLang);
    }
  };

  const handleCancel = () => {
    setSelectedLang(currentLang);
    onHide();
  };

  return (
    <Dialog
      header={t("settings.language")}
      visible={visible}
      onHide={onHide}
      style={{ width: "90vw", maxWidth: "400px" }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="language" className="text-sm">
            {t("settings.languageLabel")}
          </label>
          <Dropdown
            id="language"
            value={langs.find((lang) => lang.code === selectedLang)}
            onChange={(e) => setSelectedLang(e.value.code)}
            options={langs}
            optionLabel="nativeName"
            placeholder={t("settings.languagePlaceholder")}
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
            disabled={selectedLang === "" || selectedLang === currentLang}
            onClick={handleSave}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default LanguageDialog;
