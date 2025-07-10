import { Route, Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ErrorPage from "../pages/user/ErrorPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/unauthorized" element={<ErrorPage />} />
      {UserRoutes()}
      {AdminRoutes()}
    </Routes>
  );
};

export default AppRouter;
