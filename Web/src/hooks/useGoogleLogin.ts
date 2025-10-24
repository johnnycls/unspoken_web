import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useTranslation } from "react-i18next";
import { CredentialResponse, useGoogleOneTapLogin } from "@react-oauth/google";

const useGoogleLogin: () => {
  credentialResponse: CredentialResponse | null;
  isGoogleError: boolean;
  isGoogleSuccess: boolean;
} = () => {
  const [credentialResponse, setCredentialResponse] =
    useState<CredentialResponse | null>(null);
  const [isGoogleError, setIsGoogleError] = useState(false);
  const [isGoogleSuccess, setIsGoogleSuccess] = useState(false);
  const toast = useRef<Toast>(null);
  const { t } = useTranslation();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setIsGoogleSuccess(true);
    setCredentialResponse(credentialResponse);
  };

  const handleGoogleError = () => {
    setIsGoogleError(true);
    toast.current?.show({
      severity: "error",
      summary: t("login.googleFailedSummary"),
      detail: t("login.googleFailedDetail"),
    });
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
