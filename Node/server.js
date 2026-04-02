import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/routes.js";
import authRoutes from "./src/routes/authRoutes.js";
import itemRouter from "./src/routes/itemRoutes.js";
import connectDB from "./src/config/db.js";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

await connectDB();
// Routes
app.use("/api/v1", routes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/item", itemRouter);

// Add error-handling middleware (helps with 500 errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

export default app;
