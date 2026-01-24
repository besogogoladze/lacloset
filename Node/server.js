import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import serverless from "serverless-http";
import authRoutes from "./src/routes/authRoutes.js";
import itemRouter from "./src/routes/itemRoutes.js";
import routes from "./src/routes/routes.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;

// Connect to MongoDB once (reuse connection for serverless)
const connectToMongoDB = async () => {
  if (isConnected) return; // reuse connection
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err; // make sure serverless returns 500 if DB fails
  }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  if (!isConnected) await connectToMongoDB();
  next();
});

// Routes
app.use("/api/v1", routes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/item", itemRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

// Export for Vercel serverless
export default serverless(app);
