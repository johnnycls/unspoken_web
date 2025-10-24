import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { PrimeReactProvider } from "primereact/api";
import LoadingScreen from "../components/LoadingScreen";
import { useGetProfileQuery } from "../slices/userSlice";
import Login from "./Login";

const App: React.FC = () => {
  const { isError, isLoading, isSuccess } = useGetProfileQuery();

  return (
    <PrimeReactProvider>
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
