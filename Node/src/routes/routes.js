import express from "express";
import User from "../models/user.js";
import authMiddleware from "../middlewares/auth/authorization.js";

const router = express.Router();

// Get all users
router.get("/", authMiddleware, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    if (!req.userInfo) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({
      success: true,
      email: req.userInfo.email,
      role: req.userInfo.role,
    });
  } catch (error) {
    console.error("User route error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server problem",
    });
  }
});

export default router;
