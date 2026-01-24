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

// ==========================
// Serverless-Friendly MongoDB
// ==========================
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToMongoDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // fail fast if DB unreachable
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB");
    return cached.conn;
  } catch (err) {
    cached.promise = null; // reset so next request can retry
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

// ==========================
// Routes
// ==========================

app.use("/api/v1", routes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/item", itemRouter);

// ==========================
// Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Server Error" });
});

// ==========================
// Vercel Serverless Handler
// ==========================
const handler = serverless(app);

// Connect to MongoDB before handling any request
export default async function (req, res) {
  try {
    await connectToMongoDB(); // ensure DB connection before running routes
    return handler(req, res); // pass request to Express
  } catch (err) {
    res.status(500).json({ message: "Database connection error" });
  }
}
