import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import { Card } from "primereact/card";
import { Letter } from "../../../slices/letterSlice";
import { formatDate } from "../../../utils/time";
import { Group } from "../../../slices/groupSlice";

const Content: React.FC<{ letter: Letter; groups: Group[] }> = ({
  letter,
  groups,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

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
      </div>
    </div>
  );
};

export default Content;
