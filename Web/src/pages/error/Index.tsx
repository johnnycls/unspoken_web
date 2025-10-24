import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "../../hooks/useThemeColor";

const ErrorPage: React.FC = () => {
  useThemeColor("#FFFFFF");
  const error = useRouteError();
  let errorMessage: string;
  const { t } = useTranslation();

  if (isRouteErrorResponse(error)) {
    errorMessage =
      error.status + " " + (error.data.message || error.statusText);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = t("error.unknownError");
  }

  return (
    <div className="h-full w-full p-4 flex flex-col justify-center items-center">
      <h2 className="text-3xl">{t("error.title")}</h2>
      <p>{t("error.message")}</p>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorPage;
