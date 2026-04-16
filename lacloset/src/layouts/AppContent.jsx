
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import Header from "../layouts/Header/Header";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import Dashboard from "../pages/Dashboard";
import Error404 from "../pages/Error404";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import PasswordResetFlow from "../pages/PasswordResetFlow";
import PrivateRoute from "../router/PrivateRoute";
import PublicRoute from "../router/PublicRoute";
import AddItem from "../pages/AddItem";
import EditItem from "../pages/EditItem";
import { useAuth } from "../context/AuthContext";

function AppContent() {
  const { status } = useAuth();

  return (
    <>
      {status === "authenticated" && <Header />}

      <div className="pt-16">
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<PasswordResetFlow />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/dashboard/edit/:id" element={<EditItem />} />
          </Route>

          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </>
  );
}

export default AppContent;
