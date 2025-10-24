import { Button } from "primereact/button";
import React, { useEffect, useRef, useState } from "react";
import { profile, useUpdateProfileMutation } from "../../slices/userSlice";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import LoadingScreen from "../../components/LoadingScreen";
import { NAME_LENGTH_LIMIT } from "../../config";

const BasicInformation: React.FC<{
  prevCallback: () => void;
  nextCallback: () => void;
  profile?: profile;
}> = ({ prevCallback, nextCallback, profile }) => {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);

  const [updateProfile, { isLoading, isError, isSuccess, error }] =
    useUpdateProfileMutation();

  const [name, setName] = useState<string>(profile?.name || "");

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
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

  return (
    <>
      <div className="flex flex-col gap-2">
        <Toast ref={toast} />
        <LoadingScreen isLoading={isLoading} />

        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm">
            {t("profile.basicInfo.name.label")}
          </label>
          <InputText
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("profile.basicInfo.name.placeholder")}
            maxLength={NAME_LENGTH_LIMIT}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          label={t("profile.navigation.back")}
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={() => {
            prevCallback();
          }}
        />
        <Button
          disabled={!name || isLoading}
          label={t("profile.navigation.next")}
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            if (name === profile?.name) {
              nextCallback();
            } else {
              updateProfile({ name });
            }
          }}
        />
      </div>
    </>
  );
};

export default BasicInformation;
