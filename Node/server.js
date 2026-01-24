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
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.use((req, res, next) => {
  if (!isConnected) {
    connectToMongoDB();
  }
  next();
});

app.use("/api/v1", routes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/item", itemRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  console.log(err);
  res.status(500).json({ message: "Server Error" });
});

export default serverless(app);
