import { Route, Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ErrorPage from "../pages/user/ErrorPage";
import ShipperRoutes from "./ShipperRoutes";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/unauthorized" element={<ErrorPage />} />
      {UserRoutes()}
      {AdminRoutes()}
       {ShipperRoutes()}
    </Routes>
  );
};

export default AppRouter;
