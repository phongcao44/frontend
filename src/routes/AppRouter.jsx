import { Route, Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ErrorPage from "../pages/user/ErrorPage";
import ShipperRoutes from "./ShipperRoutes";
import OrderDetail from "../pages/user/account/OrderDetail";

const AppRouter = () => {

  return (
    <Routes>
      <Route path="/unauthorized" element={<ErrorPage />} />
      {UserRoutes()}
      {AdminRoutes()}
      {ShipperRoutes()}
      <Route path="/order/:id" element={<OrderDetail />} />

    </Routes>
  );
};

export default AppRouter;
