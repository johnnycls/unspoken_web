import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import {
  Crush,
  useCreateOrUpdateCrushMutation,
  useDeleteCrushMutation,
} from "../../../slices/crushSlice";
import { validateEmail } from "../../../utils/validation";
import { getCurrentMonth } from "../../../utils/time";
import { ToggleButton } from "primereact/togglebutton";
import { Card } from "primereact/card";

const Content: React.FC<{ crushes: Crush[] }> = ({ crushes }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = React.useRef<Toast>(null);

  const [createOrUpdateCrush, { isLoading: isUpdating }] =
    useCreateOrUpdateCrushMutation();
  const [deleteCrush, { isLoading: isDeleting }] = useDeleteCrushMutation();

  // Get current month crush
  const now = new Date();
  const currentMonth = getCurrentMonth(now);
  const currentCrush = crushes.find((crush) => crush.month === currentMonth);

  const [hasCrush, setHasCrush] = useState(!!currentCrush);
  const [email, setEmail] = useState(currentCrush?.toEmail || "");
  const [message, setMessage] = useState(currentCrush?.message || "");

  useEffect(() => {
    if (currentCrush) {
      setHasCrush(true);
      setEmail(currentCrush.toEmail);
      setMessage(currentCrush.message);
    }
  }, [currentCrush]);

  const isFormValid = () => {
    if (!hasCrush) return currentCrush !== undefined;
    return email.trim() !== "" && validateEmail(email) && message.trim() !== "";
  };

  const handleSubmit = async () => {
    // Handle removing crush
    if (!hasCrush) {
      if (!currentCrush) {
        navigate("/crush");
        return;
      }

      try {
        await deleteCrush().unwrap();
        toast.current?.show({
          severity: "success",
          summary: t("deleteCrushSuccess"),
          life: 3000,
        });
        navigate("/crush");
      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: t("deleteCrushError"),
          detail: error?.data?.message || t("deleteCrushError"),
          life: 3000,
        });
      }
      return;
    }

    if (!isFormValid()) return;

    try {
      await createOrUpdateCrush({
        toEmail: email.trim(),
        message: message.trim(),
      }).unwrap();

      toast.current?.show({
        severity: "success",
        summary: t("updateCrushSuccess"),
        life: 3000,
      });

      setTimeout(() => {
        navigate("/crush");
      }, 1000);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: t("updateCrushError"),
        detail: error?.data?.message || t("updateCrushError"),
        life: 3000,
      });
    }
  };

  const handleBack = () => {
    navigate("/crush");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Toast ref={toast} />

      <AppBar onBack={handleBack}>
        <h1 className="text-2xl">{t("crush.updateCrush")}</h1>
      </AppBar>

      <div className="w-full h-full flex p-4 overflow-y-auto justify-center items-center">
        <Card
          className="w-[90%]"
          pt={{ content: { className: "flex flex-col gap-4" } }}
        >
          <ToggleButton
            onLabel={t("crush.hasCrush")}
            offLabel={t("crush.noCrush")}
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            checked={hasCrush}
            onChange={(e) => {
              setHasCrush(e.value);
              if (!e.value) {
                setEmail("");
                setMessage("");
              }
            }}
          />

          {hasCrush && (
            <>
              <div className="flex flex-col">
                <label htmlFor="email" className="font-semibold">
                  {t("crush.crushEmail")}
                </label>
                <InputText
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("crush.emailPlaceholder")}
                  className={email && !validateEmail(email) ? "p-invalid" : ""}
                />
                {email && !validateEmail(email) && (
                  <small className="p-error">{t("invalidEmail")}</small>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="message" className="font-semibold">
                  {t("crush.message")}
                </label>
                <InputTextarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("crush.messagePlaceholder")}
                  rows={5}
                  autoResize
                />
              </div>
            </>
          )}

          <Button
            label={t("crush.updateStatus")}
            onClick={handleSubmit}
            disabled={!isFormValid() || isUpdating || isDeleting}
            loading={isUpdating || isDeleting}
            className="mt-4"
          />
        </Card>
      </div>
    </div>
  );
};

export default Content;
