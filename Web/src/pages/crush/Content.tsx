import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import BottomTab from "../../components/BottomTab";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Crush } from "../../slices/crushSlice";
import { formatUTCTime } from "../../utils/time";
import { Accordion, AccordionTab } from "primereact/accordion";

const Content: React.FC<{ crush: Crush | null }> = ({ crush }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get current day to determine which period we're in
  const now = new Date();
  const dayOfMonth = now.getDate();
  const isSubmissionPeriod = dayOfMonth <= 14; // Days 1-14
  const isViewingPeriod = !isSubmissionPeriod; // Days 15-31

  const handleUpdateClick = () => {
    navigate("/crush/update");
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <AppBar>
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl">{t("crush.title")}</h1>
        </div>
      </AppBar>

      <div className="w-full h-full flex flex-col p-4 gap-4 overflow-y-auto">
        {/* Rules Card */}
        <Accordion>
          <AccordionTab header={t("crush.rules.title")}>
            <div className="p-2 rounded-lg border border-blue-100">
              <div className="text-lg">
                {t("crush.rules.currentStage")}:
                {isSubmissionPeriod
                  ? t("crush.rules.submissionPeriod")
                  : t("crush.rules.viewingPeriod")}
              </div>
              <p className="text-xs text-gray-600">{formatUTCTime(now)}</p>
            </div>

            <div className="flex flex-col text-sm mt-2">
              <p className="font-semibold">{t("crush.rules.days1to14")}</p>
              <p>{t("crush.rules.days1to14Desc")}</p>

              <p className="font-semibold mt-1">
                {t("crush.rules.days15to31")}
              </p>
              <p>{t("crush.rules.days15to31Desc")}</p>
            </div>
          </AccordionTab>
        </Accordion>

        <Card>
          {!crush ? (
            <div className="flex flex-col items-center justify-center gap-4">
              {isSubmissionPeriod
                ? t("crush.noCrushYet")
                : t("crush.noCrushEntered")}
              {isSubmissionPeriod && (
                <Button
                  label={t("crush.updateStatus")}
                  onClick={handleUpdateClick}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold mb-2">
                {t("crush.yourCrushName")}:
              </h3>
              <p className="text-lg mb-3">{crush.toEmail}</p>

              <h3 className="font-semibold mb-2">{t("crush.yourMessage")}:</h3>
              <p className="mb-2">{crush.message}</p>

              {isViewingPeriod &&
                (crush.responseMessage ? (
                  <>
                    <h3 className="font-semibold mb-2">
                      {t("crush.heLikesYouToo")}:
                    </h3>
                    <p className="mb-2">{crush.responseMessage}</p>
                  </>
                ) : (
                  <h3 className="font-semibold mb-2">
                    {t("crush.heDoesntLikeYou")}:
                  </h3>
                ))}

              {isSubmissionPeriod && (
                <Button
                  label={t("crush.updateStatus")}
                  onClick={handleUpdateClick}
                  className="w-full"
                />
              )}

              <p className="text-sm text-gray-500">{crush.month}</p>
            </div>
          )}
        </Card>
      </div>

      <BottomTab activeIndex={1} />
    </div>
  );
};

export default Content;
