import { Button } from "primereact/button";
import React, { useEffect, useRef, useState } from "react";
import { profile, useUpdateProfileMutation } from "../../slices/userSlice";
import { InputTextarea } from "primereact/inputtextarea";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import LoadingScreen from "../../components/LoadingScreen";
import { DESCRIPTION_LENGTH_LIMIT } from "../../config";
const Description: React.FC<{
  prevCallback: () => void;
  nextCallback: () => void;
  profile?: profile;
}> = ({ prevCallback, nextCallback, profile }) => {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);

  const [updateProfile, { isLoading, isError, isSuccess, error }] =
    useUpdateProfileMutation();

  const [description, setDescription] = useState<string>(
    profile?.description || ""
  );

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
      <div className="flex flex-col gap-4">
        <Toast ref={toast} />
        <LoadingScreen isLoading={isLoading} />

        <div className="w-full flex flex-col">
          {description.length < 5 && (
            <label>{t("profile.description.label")}</label>
          )}
          <InputTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            autoResize
            placeholder={t("profile.description.placeholder")}
            maxLength={DESCRIPTION_LENGTH_LIMIT}
          />
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
            disabled={!description}
            label={t("profile.navigation.finish")}
            iconPos="right"
            icon="pi pi-arrow-right"
            onClick={() => {
              if (description === profile?.description) {
                nextCallback();
              } else {
                updateProfile({ description });
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Description;
