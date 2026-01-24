import express from "express";

import {
  signUp,
  login,
  forgotPassword,
  verifyForgotPassword,
  logOut,
  verifyCode,
  changePassword,
  verifyChangePassword,
} from "../controllers/auth.js";
import { identifier } from "../middlewares/auth/identification.js";
import authMiddleware from "../middlewares/auth/authorization.js";

const router = express.Router();

// register a new user ( admin ou cuisine )
router.post("/signup", signUp);

// login user account
router.post("/login", login);

// logout user account
router.post("/logout", identifier, logOut);

// forgot password function
router.post("/forgot-password", forgotPassword);

// forgot password verification code
router.post("/verify-forgot-password", verifyForgotPassword);

// send verification code ( 6 digit for security )
// router.post("/send-verification-code", sendVerificationCode);

// verify the code
router.post("/verify-code", verifyCode);

// change password link
router.patch("/change-password", authMiddleware, changePassword);

// verify change password
router.post("/verify-change-password", authMiddleware, verifyChangePassword);

export default router;
