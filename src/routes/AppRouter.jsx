import { Route, Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ErrorPage from "../pages/user/ErrorPage";
import ShipperRoutes from "./ShipperRoutes";
import OrderTrackingPage from "../pages/admin/shipper/OrderTrackingPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/unauthorized" element={<ErrorPage />} />
      {UserRoutes()}
      {AdminRoutes()}
      {ShipperRoutes()}
      <Route path="/admin/shipper/:orderId" element={<OrderTrackingPage />} />
    </Routes>
  );
};

export default AppRouter;
