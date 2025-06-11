import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");
  const location = useLocation();

  if (!token || !role || !allowedRoles.some(allowedRole => role.includes(allowedRole))) {
    // Chuyển hướng đến login, kèm theo URL hiện tại (bao gồm query parameters)
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return <Outlet />;
};