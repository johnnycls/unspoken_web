import React, { useEffect, useState } from "react";
import { profile, useUpdateProfileMutation } from "../../slices/userSlice";
import { useTranslation } from "react-i18next";
import AppBar from "../../components/AppBar";
import BottomTab from "../../components/BottomTab";
import { Button } from "primereact/button";
import LoadingScreen from "../../components/LoadingScreen";
import SettingsList from "./SettingsList";
import DisplayNameDialog from "./DisplayNameDialog";
import LanguageDialog from "./LanguageDialog";
import { useAppDispatch } from "../../app/store";
import { showToast } from "../../slices/toastSlice";

const Content: React.FC<{ profile?: profile }> = ({ profile }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [updateProfile, { isLoading, isError, isSuccess }] =
    useUpdateProfileMutation();

  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showLangDialog, setShowLangDialog] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        showToast({
          severity: "success",
          summary: t("updateProfileSuccess"),
        })
      );
      setShowNameDialog(false);
      setShowLangDialog(false);
    }
  }, [isSuccess, t, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(
        showToast({
          severity: "error",
          summary: t("updateProfileError"),
        })
      );
    }
  }, [isError, t, dispatch]);

  const handleNameSave = (name: string) => {
    updateProfile({ name });
  };

  const handleLangSave = (lang: string) => {
    updateProfile({ lang });
  };

  const handleSupportUsClick = () => {
    window.open("https://buymeacoffee.com/unspokenwe2", "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <LoadingScreen isLoading={isLoading} />

      <AppBar>
        <h1 className="text-2xl">{t("settings.title")}</h1>
      </AppBar>

      <div className="w-full h-full flex flex-col overflow-y-auto">
        <SettingsList
          email={profile?.email}
          displayName={profile?.name}
          language={profile?.lang}
          onDisplayNameClick={() => setShowNameDialog(true)}
          onLanguageClick={() => setShowLangDialog(true)}
        />

        <div className="pb-3 px-4 mt-auto flex flex-col gap-2">
          <Button
            label={t("settings.supportUs")}
            onClick={handleSupportUsClick}
          />
          <Button
            label={t("settings.logout")}
            icon="pi pi-sign-out"
            severity="danger"
            onClick={handleLogout}
          />
        </div>
      </div>

      <DisplayNameDialog
        visible={showNameDialog}
        currentName={profile?.name || ""}
        onHide={() => setShowNameDialog(false)}
        onSave={handleNameSave}
      />

      <LanguageDialog
        visible={showLangDialog}
        currentLang={profile?.lang || ""}
        onHide={() => setShowLangDialog(false)}
        onSave={handleLangSave}
      />

      {<BottomTab activeIndex={3} />}
    </div>
  );
};

export default Content;
