import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Header from "./layouts/Header/Header";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import Dashboard from "./pages/Dashboard";
import Error404 from "./pages/Error404";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import PasswordResetFlow from "./pages/PasswordResetFlow";
// import SignupPage from "./pages/SignupPage";
import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Header />
          <div className="pt-16">
            <Routes>
              {/* Public routes for login/signup (redirect if logged in) */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<LoginPage />} />
                {/* <Route path="/signup" element={<SignupPage />} /> */}
              </Route>

              {/* Password reset routes are always public */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<PasswordResetFlow />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />

              {/* Private routes (require login) */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/dashboard/edit/:id" element={<EditItem />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </div>
          <ToastContainer position="bottom-right" autoClose={2000} />
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
