import React, { useEffect } from "react";
import useLogin from "../hooks/useLogin";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { CredentialResponse } from "@react-oauth/google";
import { useLoginMutation } from "../slices/authSlice";
import { useAppDispatch } from "./store";
import { showToast } from "../slices/toastSlice";

const Login: React.FC<{}> = ({}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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
      dispatch(
        showToast({
          severity: "error",
          summary: t("loginError"),
        })
      );
    }
  }, [isLoginError, dispatch, t]);

  const handleGoogleError = () => {
    dispatch(
      showToast({
        severity: "error",
        summary: t("loginError"),
      })
    );
  };

  useEffect(() => {
    if (isGoogleSuccess && credentialResponse) {
      login({ credentials: credentialResponse });
    }
  }, [isGoogleSuccess, credentialResponse]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
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
