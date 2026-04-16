import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { status } = useAuth();

  if (status === "checking") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
