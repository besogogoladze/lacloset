// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  login,
  verifyLoginCode,
  // signup,
  forgotPassword,
  verifyForgotPassword,
  sendChangePasswordCode,
  verifyChangePassword,
} from "../types/auth.api";
import { useAuthUser } from "../services/hooks/useAuthUser";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // 🔐 Validate token
  const meQuery = useAuthUser(!!token);

  useEffect(() => {
    if (token && meQuery.isError) {
      // Token is invalid/expired
      localStorage.removeItem("token");
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  }, [meQuery.isError, navigate, queryClient, token]);

  // ✅ derive auth status
  const status = useMemo(() => {
    if (!token) return "unauthenticated";
    if (meQuery.isLoading) return "checking";
    if (meQuery.isSuccess) return "authenticated";
    return "unauthenticated";
  }, [token, meQuery.isLoading, meQuery.isSuccess]);

  const isAuthenticated = status === "authenticated";

  // -----------------------------
  // LOGIN
  // -----------------------------
  const loginMutation = useMutation({
    mutationFn: login,
    onError: (err) =>
      toast.error(err.response?.data?.message || "Login failed"),
  });

  const verifyCodeMutation = useMutation({
    mutationFn: verifyLoginCode,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("შესვლა წარმატებით დასრულდა!");
      navigate("/dashboard", { replace: true });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Invalid code"),
  });

  // -----------------------------
  // SIGNUP
  // -----------------------------
  // const signupMutation = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => {
  //     toast.success("Signup successful!");
  //     navigate("/login");
  //   },
  // });

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  // -----------------------------
  // PASSWORD FLOWS
  // -----------------------------
  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => toast.success(data.message || "Code sent"),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ email, providedCode, newPassword }) =>
      verifyForgotPassword({ email, providedCode, newPassword }),
    onSuccess: (data) => {
      toast.success(data.message || "Password updated");
      navigate("/login");
    },
  });

  const sendCodeMutation = useMutation({
    mutationFn: sendChangePasswordCode,
    onSuccess: (data) => toast.success(data.message || "Code sent"),
  });

  const verifyMutation = useMutation({
    mutationFn: verifyChangePassword,
    onSuccess: (data) => toast.success(data.message || "Password changed"),
  });

  return (
    <AuthContext.Provider
      value={{
        token,
        user: meQuery.data,
        status,
        isAuthenticated,

        loginMutation,
        verifyCodeMutation,
        // signupMutation,

        forgotPasswordMutation,
        resetPasswordMutation,
        sendCodeMutation,
        verifyMutation,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
