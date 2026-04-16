import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { status } = useAuth();

  if (status === "checking") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
