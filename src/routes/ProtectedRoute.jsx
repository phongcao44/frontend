/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;

  const token = Cookies.get("access_token");

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !user?.roles?.some((role) => allowedRoles.includes(role))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
