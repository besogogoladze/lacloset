import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import itemRouter from "./src/routes/itemRoutes.js";
import routes from "./src/routes/routes.js";

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

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

app.listen(5000, () => console.log("listening..."));
