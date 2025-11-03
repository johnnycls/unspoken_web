import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CredentialResponse, useGoogleOneTapLogin } from "@react-oauth/google";
import { useAppDispatch } from "../app/store";
import { showToast } from "../slices/toastSlice";

const useGoogleLogin: () => {
  credentialResponse: CredentialResponse | null;
  isGoogleError: boolean;
  isGoogleSuccess: boolean;
} = () => {
  const [credentialResponse, setCredentialResponse] =
    useState<CredentialResponse | null>(null);
  const [isGoogleError, setIsGoogleError] = useState(false);
  const [isGoogleSuccess, setIsGoogleSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setIsGoogleSuccess(true);
    setCredentialResponse(credentialResponse);
  };

  const handleGoogleError = () => {
    setIsGoogleError(true);
    dispatch(
      showToast({
        severity: "error",
        summary: t("login.googleFailedSummary"),
      })
    );
  };

  useGoogleOneTapLogin({
    use_fedcm_for_prompt: true,
    cancel_on_tap_outside: false,
    auto_select: true,
    onSuccess: (credentialResponse) => {
      handleGoogleSuccess(credentialResponse);
    },
    onError: () => {
      handleGoogleError();
    },
  });

  return {
    credentialResponse,
    isGoogleError,
    isGoogleSuccess,
  };
};

export default useGoogleLogin;
