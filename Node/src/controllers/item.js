import item from "../models/item.js";
import {
  createItemSchema,
  updateItemSchema,
} from "../middlewares/core/itemValidator.js";

// CREATE a new Item
export const createItem = async (req, res) => {
  try {
    const { error } = createItemSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const newItem = await item.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Item successfully created",
      item: newItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Item by name
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updateItemSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const updatedItem = await item.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const foundedItem = await item.findById(id);

    if (!foundedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    foundedItem.status = status;
    await foundedItem.save();

    res.json({ success: true, foundedItem });
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE Item by name
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await item.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET a Item by name
export const getItem = async (req, res) => {
  try {
    const { name } = req.params;

    const item = await item.findOne({ name: name });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET all Items
export const getAllItems = async (req, res) => {
  try {
    const items = await item.find();

    if (items.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No Items in database", items: [] });
    }

    return res.status(200).json({ success: true, items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

