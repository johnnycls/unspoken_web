import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import { Card } from "primereact/card";
import { Letter } from "../../../slices/letterSlice";
import { formatDate } from "../../../utils/time";

const Content: React.FC<{ letter: Letter }> = ({ letter }) => {
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
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-semibold text-lg">{letter.alias}</h3>
              <span className="text-sm text-gray-500">
                {formatDate(letter.timestamp)}
              </span>
            </div>

            <div className="whitespace-pre-wrap text-gray-700">
              {letter.content}
            </div>

            <div className="border-t pt-2 text-sm text-gray-500">
              <p>
                {t("letter.to")}: {letter.toEmail}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Content;
