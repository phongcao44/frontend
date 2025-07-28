// src/routes/ShipperRoutes.js

import { Route } from "react-router-dom";
import ShipperLayout from "../layouts/ShipperLayout"; 
import ShipperManagement from "../pages/shipper/dashboard/ShipperManagement";
import ShipperDetail from "../pages/shipper/dashboard/ShipperDetail";
import ErrorPage from "../pages/user/ErrorPage"; 

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
