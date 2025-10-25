import { Outlet, createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/error/Index";
import Settings from "../pages/settings/Index";
import Groups from "../pages/group/Index";
import GroupDetail from "../pages/group/detail/Index";
import GroupForm from "../pages/group/form/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Settings /> },
      { path: "settings", element: <Settings /> },
      { path: "groups", element: <Groups /> },
      { path: "groups/create", element: <GroupForm /> },
      { path: "groups/:groupId", element: <GroupDetail /> },
      { path: "groups/:groupId/edit", element: <GroupForm /> },
    ],
  },
]);

export default router;
