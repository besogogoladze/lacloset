import express from "express";
import {
  createItem,
  deleteItem,
  getAllItems,
  getItem,
  getItemByLanguage,
  updateItem,
  updateItemStatus,
} from "../controllers/item.js";
import authMiddleware from "../middlewares/auth/authorization.js";

const itemRoutes = express.Router();

itemRoutes.post("/", authMiddleware, createItem);

itemRoutes.get("/", authMiddleware, getItemByLanguage);

itemRoutes.get("/itemsList", authMiddleware, getAllItems);

itemRoutes.get("/getItem/:nom", authMiddleware, getItem);

itemRoutes.put("/updateItem/:id", authMiddleware, updateItem);

itemRoutes.patch("/updateItem/:id/status", authMiddleware, updateItemStatus);

itemRoutes.delete("/deleteItem/:id", authMiddleware, deleteItem);

export default itemRoutes;
