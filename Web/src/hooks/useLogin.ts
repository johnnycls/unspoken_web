import { useEffect } from "react";
import { useLoginMutation } from "../slices/authSlice";
import useGoogleLogin from "./useGoogleLogin";

const useLogin: () => {
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
} = () => {
  const { credentialResponse, isGoogleError, isGoogleSuccess } =
    useGoogleLogin();
  const [login, { isError, isLoading, isSuccess }] = useLoginMutation();

  useEffect(() => {
    if (isGoogleSuccess && credentialResponse) {
      login({ credentials: credentialResponse });
    }
  }, [isGoogleSuccess]);

  return {
    isError: isError || isGoogleError,
    isLoading,
    isSuccess,
  };
};

export default useLogin;
