import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useRef, useState } from "react";
import { langs } from "../../assets/langs";
import { profile, useUpdateProfileMutation } from "../../slices/userSlice";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import LoadingScreen from "../../components/LoadingScreen";
import i18next from "i18next";

const Language: React.FC<{
  nextCallback: () => void;
  profile?: profile;
}> = ({ nextCallback, profile }) => {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);

  const [updateProfile, { isLoading, isError, isSuccess, error }] =
    useUpdateProfileMutation();

  const [lang, setLang] = useState<string>(profile?.lang || "");

  useEffect(() => {
    if (profile?.lang) {
      setLang(profile.lang);
    }
  }, [profile]);

  useEffect(() => {
    if (isSuccess) {
      nextCallback();
    }
  }, [isSuccess, nextCallback]);

  useEffect(() => {
    if (isError) {
      toast.current?.show({
        severity: "error",
        summary: t("updateProfileError"),
      });
    }
  }, [isError, t, error]);

  const genderOptions = [
    { label: t("profile.basicInfo.gender.options.male"), value: "male" },
    { label: t("profile.basicInfo.gender.options.female"), value: "female" },
    { label: t("profile.basicInfo.gender.options.other"), value: "other" },
  ];

  return (
    <>
      <div className="flex flex-col gap-2">
        <Toast ref={toast} />
        <LoadingScreen isLoading={isLoading} />

        <div className="flex flex-col">
          <label htmlFor="language" className="text-sm">
            {t("profile.basicInfo.language.label")}
          </label>
          <Dropdown
            value={langs.find((_lang) => _lang.code === lang)}
            onChange={(e) => {
              i18next.changeLanguage(e.value.code);
              setLang(e.value.code);
            }}
            options={langs}
            optionLabel="nativeName"
            placeholder={t("profile.basicInfo.language.placeholder")}
          />
        </div>

        <Button
          disabled={lang === ""}
          label={t("profile.navigation.next")}
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            if (lang === profile?.lang) {
              updateProfile({ lang });
            } else {
              updateProfile({ lang });
            }
          }}
        />
      </div>
    </>
  );
};

export default Language;
