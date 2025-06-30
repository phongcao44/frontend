import { Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRouter = () => {
  return (
    <Routes>
      {UserRoutes()}
      {AdminRoutes()}
    </Routes>
  );
};

export default AppRouter;
