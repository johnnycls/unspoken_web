import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { Group } from "../../../slices/groupSlice";
import { Letter, useSendLetterMutation } from "../../../slices/letterSlice";
import { validateEmail } from "../../../utils/validation";
import { isSameDay } from "../../../utils/time";
import { NAME_LENGTH_LIMIT, LETTER_LENGTH_LIMIT } from "../../../config";
import { profile } from "../../../slices/userSlice";

const Content: React.FC<{
  groups: Group[];
  letters: Letter[];
  profile: profile | null;
}> = ({ groups, letters, profile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = React.useRef<Toast>(null);

  const [sendLetter, { isLoading: isSending }] = useSendLetterMutation();

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [alias, setAlias] = useState("");
  const [content, setContent] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const last_written_letters = letters.filter(
    (l) => l.toEmail !== profile?.email
  );

  // Get last letter's alias if any
  useEffect(() => {
    if (last_written_letters.length === 0) return;
    {
      setAlias(last_written_letters[last_written_letters.length - 1].alias);
    }
  }, [letters]);

  // Reset user when group changes
  useEffect(() => {
    setSelectedUser("");
  }, [selectedGroup]);

  // Check if can send (1 letter per day limit)
  const canSendToday = () => {
    if (last_written_letters.length <= 1) return true;

    const lastLetterDate = new Date(
      last_written_letters[last_written_letters.length - 2].timestamp
    );
    const now = new Date();
    return !isSameDay(lastLetterDate, now);
  };

  // Get available users from selected group
  const availableUsers = selectedGroup
    ? selectedGroup.memberEmails
        .filter((email) => email !== profile?.email)
        .map((email) => ({
          label: email,
          value: email,
        }))
    : [];

  const groupOptions = groups
    .filter((group) => group.memberEmails.length > 1)
    .map((group) => ({
      label: group.name,
      value: group,
    }));

  const isFormValid = () => {
    return (
      selectedGroup !== null &&
      selectedUser !== "" &&
      validateEmail(selectedUser) &&
      alias.trim() !== "" &&
      content.trim() !== "" &&
      acknowledged &&
      canSendToday
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !selectedGroup) return;

    try {
      await sendLetter({
        fromGroupId: selectedGroup.id,
        toEmail: selectedUser,
        alias: alias.trim(),
        content: content.trim(),
      }).unwrap();

      toast.current?.show({
        severity: "success",
        summary: t("letter.sendSuccess"),
        life: 3000,
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: t("letter.sendError"),
        detail: error?.data?.message || t("letter.sendError"),
        life: 3000,
      });
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Toast position="top-right" ref={toast} />

      <AppBar onBack={handleBack}>
        <h1 className="text-2xl">{t("letter.newLetter")}</h1>
      </AppBar>

      <div className="w-full h-full flex overflow-y-auto p-4">
        <Card
          className="w-full h-full overflow-y-auto"
          pt={{ content: { className: "flex flex-col gap-4" } }}
        >
          {/* Group Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="group" className="font-semibold">
              {t("letter.selectGroup")}
            </label>
            <Dropdown
              id="group"
              value={selectedGroup}
              options={groupOptions}
              onChange={(e) => setSelectedGroup(e.value)}
              placeholder={t("letter.selectGroupPlaceholder")}
              className="w-full"
            />
          </div>

          {/* User Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="user" className="font-semibold">
              {t("letter.selectUser")}
            </label>
            <Dropdown
              id="user"
              value={selectedUser}
              options={availableUsers}
              onChange={(e) => setSelectedUser(e.value)}
              placeholder={t("letter.selectUserPlaceholder")}
              className="w-full"
              disabled={!selectedGroup}
            />
          </div>

          {/* Alias Input */}
          <div className="flex flex-col">
            <label htmlFor="alias" className="font-semibold">
              {t("letter.alias")}
            </label>
            <InputText
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder={t("letter.aliasPlaceholder")}
              maxLength={NAME_LENGTH_LIMIT}
            />
          </div>

          {/* Content Textarea */}
          <div className="flex flex-col">
            <label htmlFor="content" className="font-semibold">
              {t("letter.content")}
            </label>
            <InputTextarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("letter.contentPlaceholder")}
              rows={8}
              autoResize
              maxLength={LETTER_LENGTH_LIMIT}
            />
          </div>

          {/* Acknowledgment Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              inputId="acknowledge"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.checked || false)}
            />
            <label htmlFor="acknowledge" className="text-sm">
              {t("letter.acknowledgment")}
            </label>
          </div>

          {/* Warning if can't send today */}
          {canSendToday() ? (
            <Button
              label={t("letter.sendLetter")}
              onClick={handleSubmit}
              disabled={!isFormValid() || isSending}
              loading={isSending}
              className="mt-4"
            />
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {t("letter.cannotSendYet")}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Content;
