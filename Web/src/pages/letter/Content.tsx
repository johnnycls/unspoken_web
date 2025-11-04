import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import BottomTab from "../../components/BottomTab";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { SelectButton } from "primereact/selectbutton";
import { Letter } from "../../slices/letterSlice";
import { formatDate, formatUTCTime } from "../../utils/time";
import { getPreviewContent } from "../../utils/general";

type FilterOption = "inbox" | "outbox";

const Content: React.FC<{ letters: Letter[]; userEmail: string }> = ({
  letters,
  userEmail,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<FilterOption>("inbox");

  const filterOptions = [
    { label: t("letter.inbox"), value: "inbox" },
    { label: t("letter.outbox"), value: "outbox" },
  ];

  const filteredLetters = letters.filter((letter) => {
    if (filter === "inbox") {
      return letter.toEmail === userEmail;
    } else {
      return letter.toEmail !== userEmail;
    }
  });

  const handleNewLetter = () => {
    navigate("/new");
  };

  const handleLetterClick = (letter: Letter) => {
    // Find the original index in the full letters array
    const originalIndex = letters.findIndex((l) => l === letter);
    if (originalIndex !== -1) {
      navigate(`/${originalIndex}`);
    }
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
        <div className="flex justify-center">
          <SelectButton
            value={filter}
            onChange={(e) => setFilter(e.value)}
            options={filterOptions}
          />
        </div>
        <Card>
          <p className="text-center">{t("letter.updateReminder")}</p>
          <p className="text-gray-500 text-right text-xs">
            {formatUTCTime(new Date())}
          </p>
        </Card>
        {filteredLetters.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center gap-2">
              <p>
                {filter === "inbox"
                  ? t("letter.noInboxLetters")
                  : t("letter.noOutboxLetters")}
              </p>
              {filter === "outbox" && (
                <Button
                  label={t("letter.sendFirstLetter")}
                  onClick={handleNewLetter}
                />
              )}
            </div>
          </Card>
        ) : (
          filteredLetters.map((letter, index) => (
            <Card
              key={index}
              className="cursor-pointer"
              onClick={() => handleLetterClick(letter)}
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
