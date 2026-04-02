// src/api/auth.api.js

import api from "./api";

// -----------------------------
// USER
// -----------------------------
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/user");
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      return null;
    }
    throw err; // rethrow other errors
  }
};

// -----------------------------
// LOGIN
// -----------------------------
export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", {
    email: email.toLowerCase(),
    password,
  });
  return res.data;
};

export const verifyLoginCode = async ({ email, providedCode }) => {
  const res = await api.post("/auth/verify-code", {
    email: email.toLowerCase(),
    providedCode,
  });
  return res.data;
};

// -----------------------------
// SIGNUP
// -----------------------------
// export const signup = async ({ email, password }) => {
//   const res = await api.post("/auth/signup", {
//     email,
//     password,
//   });
//   return res.data;
// };

// -----------------------------
// FORGOT PASSWORD
// -----------------------------
export const forgotPassword = async ({ email }) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const verifyForgotPassword = async ({
  email,
  providedCode,
  newPassword,
}) => {
  const res = await api.post("/auth/verify-forgot-password", {
    email,
    providedCode,
    newPassword,
  });
  return res.data;
};

// -----------------------------
// CHANGE PASSWORD (LOGGED IN)
// -----------------------------
export const sendChangePasswordCode = async () => {
  const res = await api.patch("/auth/change-password");
  return res.data;
};

export const verifyChangePassword = async ({ providedCode, newPassword }) => {
  const res = await api.post("/auth/verify-change-password", {
    providedCode,
    newPassword,
  });
  return res.data;
};
