import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import mongoose from "mongoose";

import authRoutes from "./src/routes/authRoutes.js";
import itemRouter from "./src/routes/itemRoutes.js";
import routes from "./src/routes/routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== Serverless-friendly MongoDB Connection =====
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectToMongoDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        // optional settings
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // 5 sec timeout
      })
      .then((mongoose) => {
        console.log("Connected to MongoDB");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection error" });
  }
});

// ===== Routes =====
app.use("/api/v1", routes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/item", itemRouter);

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Server Error" });
});

// ===== Export for Vercel =====
export default serverless(app);
