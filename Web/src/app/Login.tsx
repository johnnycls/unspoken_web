import React, { useEffect } from "react";
import useLogin from "../hooks/useLogin";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import { GoogleLogin } from "@react-oauth/google";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { CredentialResponse } from "@react-oauth/google";
import { useLoginMutation } from "../slices/authSlice";

const Login: React.FC<{}> = ({}) => {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);

  const [credentialResponse, setCredentialResponse] =
    useState<CredentialResponse | null>(null);
  const [isGoogleSuccess, setIsGoogleSuccess] = useState(false);

  const { isLoading } = useLogin();
  const [login, { isError: isLoginError, isLoading: isLoginLoading }] =
    useLoginMutation();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setIsGoogleSuccess(true);
    setCredentialResponse(credentialResponse);
  };

  useEffect(() => {
    if (isLoginError) {
      toast.current?.show({
        severity: "error",
        summary: t("loginError"),
      });
    }
  }, [isLoginError]);

  const handleGoogleError = () => {
    toast.current?.show({
      severity: "error",
      summary: t("loginError"),
    });
  };

  useEffect(() => {
    if (isGoogleSuccess && credentialResponse) {
      login({ credentials: credentialResponse });
    }
  }, [isGoogleSuccess, credentialResponse]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <Toast position="top-right" ref={toast} />
      <LoadingScreen isLoading={isLoading || isLoginLoading} />
      <GoogleLogin
        use_fedcm_for_prompt
        auto_select
        onSuccess={(credentialResponse) => {
          handleGoogleSuccess(credentialResponse);
        }}
        onError={() => {
          handleGoogleError();
        }}
      />
    </div>
  );
};

export default Login;
