import React from "react";
import { Outlet } from "react-router-dom";

const ShipperLayout = () => {
  return (
    <div>
      <header>Shipper</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ShipperLayout;
