import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import BottomTab from "../../components/BottomTab";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Letter } from "../../slices/letterSlice";
import { formatDate, formatUTCTime } from "../../utils/time";
import { getPreviewContent } from "../../utils/general";

const Content: React.FC<{ letters: Letter[] }> = ({ letters }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNewLetter = () => {
    navigate("/new");
  };

  const handleLetterClick = (index: number) => {
    navigate(`/${index}`);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <AppBar>
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl">{t("letter.mailbox")}</h1>
          <Button
            icon="pi pi-plus"
            className="p-0!"
            onClick={handleNewLetter}
          />
        </div>
      </AppBar>

      <div className="w-full h-full flex flex-col p-4 gap-4 overflow-y-auto">
        <Card>
          <p className="text-center">{t("letter.updateReminder")}</p>
          <p className="text-gray-500 text-right text-xs">
            {formatUTCTime(new Date())}
          </p>
        </Card>
        {letters.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center gap-2">
              <p>{t("letter.noLettersYet")}</p>
              <Button
                label={t("letter.sendFirstLetter")}
                onClick={handleNewLetter}
              />
            </div>
          </Card>
        ) : (
          letters.map((letter, index) => (
            <Card
              key={index}
              className="cursor-pointer"
              onClick={() => handleLetterClick(index)}
              title={letter.alias}
              footer={
                <p className="text-gray-600 text-right text-xs">
                  {formatDate(letter.timestamp)}
                </p>
              }
              pt={{ body: { className: "gap-0!" } }}
            >
              <p className="text-gray-500">
                {getPreviewContent(letter.content)}
              </p>
            </Card>
          ))
        )}
      </div>

      <BottomTab activeIndex={0} />
    </div>
  );
};

export default Content;
