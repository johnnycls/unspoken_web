import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import BottomTab from "../../components/BottomTab";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Letter } from "../../slices/letterSlice";

const Content: React.FC<{ letters: Letter[] }> = ({ letters }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNewLetter = () => {
    navigate("/new");
  };

  const handleLetterClick = (index: number) => {
    navigate(`/${index}`);
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getPreviewContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
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
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-lg">{letter.alias}</h3>
                <span className="text-sm text-gray-500">
                  {formatDate(letter.timestamp)}
                </span>
                <p className="text-gray-600">
                  {getPreviewContent(letter.content)}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      <BottomTab activeIndex={0} />
    </div>
  );
};

export default Content;
