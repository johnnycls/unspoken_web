import { Outlet, createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/error/Index";
import Profile from "../pages/profile/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [{ path: "profile", element: <Profile /> }],
  },
]);

export default router;
