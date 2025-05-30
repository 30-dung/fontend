import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  if (!token || !role || !allowedRoles.some(allowedRole => role.includes(allowedRole))) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};