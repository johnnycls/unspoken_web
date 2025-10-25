import { Outlet, createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/error/Index";
import Settings from "../pages/settings/Index";
import Groups from "../pages/group/Index";
import GroupDetail from "../pages/group/detail/Index";
import GroupForm from "../pages/group/form/Index";
import Crush from "../pages/crush/Index";
import UpdateCrush from "../pages/crush/update/Index";
import Letter from "../pages/letter/Index";
import NewLetter from "../pages/letter/new/Index";
import LetterDetail from "../pages/letter/detail/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Letter /> },
      { path: "new", element: <NewLetter /> },
      { path: ":index", element: <LetterDetail /> },
      { path: "settings", element: <Settings /> },
      { path: "crush", element: <Crush /> },
      { path: "crush/update", element: <UpdateCrush /> },
      { path: "groups", element: <Groups /> },
      { path: "groups/create", element: <GroupForm /> },
      { path: "groups/:groupId", element: <GroupDetail /> },
      { path: "groups/:groupId/edit", element: <GroupForm /> },
    ],
  },
]);

export default router;
