import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Letter, useReplyToLetterMutation } from "../../../slices/letterSlice";
import { formatDate } from "../../../utils/time";
import { Group } from "../../../slices/groupSlice";
import { useAppDispatch } from "../../../app/store";
import { showToast } from "../../../slices/toastSlice";

const Content: React.FC<{
  letter: Letter;
  groups: Group[];
  userEmail: string;
}> = ({ letter, groups, userEmail }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [replyContent, setReplyContent] = React.useState("");
  const [replyToLetter, { isLoading: isReplying }] = useReplyToLetterMutation();

  const handleBack = () => {
    navigate("/");
  };

  const handleReply = async () => {
    try {
      await replyToLetter({
        letterId: letter.id,
        content: replyContent,
      }).unwrap();

      dispatch(
        showToast({ severity: "success", summary: t("letter.replySuccess") })
      );
      setReplyContent("");
    } catch (error: any) {
      dispatch(
        showToast({
          severity: "error",
          summary: error?.data?.message || t("letter.replyError"),
        })
      );
    }
  };

  const isRecipient = letter.toEmail.toLowerCase() === userEmail.toLowerCase();
  const hasReply = letter.replyContent && letter.replyContent.trim() !== "";

  return (
    <div className="w-full h-full flex flex-col">
      <AppBar onBack={handleBack}>
        <h1 className="text-2xl">{letter.alias}</h1>
      </AppBar>

      <div className="w-full h-full flex flex-col p-4 gap-4 overflow-y-auto">
        <Card
          pt={{ title: { className: "m-0!" } }}
          title={letter.alias}
          footer={
            <div className="text-sm text-gray-500">
              <p>
                {t("letter.to")}: {letter.toEmail}
                <br />
                {t("letter.fromGroup")}:{" "}
                {groups.find((g) => g.id === letter.fromGroupId)?.name ||
                  t("letter.deletedGroup")}
                <br />
                {formatDate(letter.timestamp)}
              </p>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="whitespace-pre-wrap">{letter.content}</div>
          </div>
        </Card>

        {hasReply ? (
          <Card title={t("letter.reply")}>
            <div className="whitespace-pre-wrap">{letter.replyContent}</div>
          </Card>
        ) : (
          isRecipient && (
            <div className="flex flex-col gap-3">
              <InputTextarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={5}
                placeholder={t("letter.replyPlaceholder")}
                className="w-full"
              />
              <Button
                label={t("letter.sendReply")}
                onClick={handleReply}
                disabled={isReplying || !replyContent.trim()}
                loading={isReplying}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Content;
