// src/routes/ShipperRoutes.js

import { Route } from "react-router-dom";
import ShipperLayout from "../layouts/ShipperLayout"; // Layout riêng cho shipper nếu có
import ShipperManagement from "../pages/shipper/dashboard/ShipperManagement";
import ShipperDetail from "../pages/shipper/dashboard/ShipperDetail";
import ErrorPage from "../pages/user/ErrorPage"; // dùng chung hoặc tạo riêng

const ShipperRoutes = () => {
  return (
    <Route path="/shipper" element={<ShipperLayout />}>
      <Route path="dashboard" element={<ShipperManagement />} />
      <Route path="dashboard/:id" element={<ShipperDetail />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  );
};

export default ShipperRoutes;
