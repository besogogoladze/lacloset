import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import Header from "../layouts/Header/Header";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { status } = useAuth();

  if (status === "checking") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return status === "authenticated" ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
