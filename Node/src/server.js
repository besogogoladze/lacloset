import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import serverless from "serverless-http";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js";
import authRoutes from "./routes/authRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB once (reuse connection for serverless)
let isConnected = false;
const dbConnect = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Routes
app.use("/", async (req, res) => {
  await dbConnect();
  res.json({ name: "beso" });
});

app.use(
  "/api/v1",
  async (req, res, next) => {
    await dbConnect();
    next();
  },
  routes,
);

app.use(
  "/api/v1/auth",
  async (req, res, next) => {
    await dbConnect();
    next();
  },
  authRoutes,
);

app.use(
  "/api/v1/item",
  async (req, res, next) => {
    await dbConnect();
    next();
  },
  itemRouter,
);

app.use(
  "/api/images",
  async (req, res, next) => {
    await dbConnect();
    next();
  },
  imageRouter,
);

app.use("/file", express.static("uploads"));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

// Wrap Express app with serverless-http
export default serverless(app);
