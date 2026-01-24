import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { status } = useAuth();

  if (status === "checking") {
    return null; // or spinner
  }

  return status === "unauthenticated" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default PublicRoute;
