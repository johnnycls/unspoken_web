import React, { useRef, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import LoadingScreen from "../components/LoadingScreen";
import { useGetProfileQuery } from "../slices/userSlice";
import { useAppSelector, useAppDispatch } from "./store";
import Login from "./Login";
import { useLanguageFont } from "../hooks/useLanguageFont";

const App: React.FC = () => {
  const { isError, isLoading, isSuccess } = useGetProfileQuery();
  const toastRef = useRef<Toast>(null);
  const dispatch = useAppDispatch();
  const toastState = useAppSelector((state) => state.toast);

  useLanguageFont();

  useEffect(() => {
    if (toastState.message) {
      toastRef.current?.show({ ...toastState.message, life: 3000 });
    }
  }, [toastState.message, dispatch]);

  return (
    <PrimeReactProvider>
      <Toast position="top-right" ref={toastRef} />
      {isError ? (
        <Login />
      ) : (
        <>
          <LoadingScreen isLoading={isLoading} />
          {isSuccess && <RouterProvider router={router} />}
        </>
      )}
    </PrimeReactProvider>
  );
};

export default App;
