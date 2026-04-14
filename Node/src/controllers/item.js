import Item from "../models/item.js";
import {
  createItemSchema,
  updateItemSchema,
} from "../middlewares/core/itemValidator.js";

// CREATE a new Item
export const createItem = async (req, res) => {
  try {
    const { error } = createItemSchema.validate(req.body, {
      allowUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const newItem = await Item.create(req.body);

    return res.status(201).json({
      success: true,
      message: "პროდუქტი წარმატებით შეიქმნა",
      item: newItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Item by id
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updateItemSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const updatedItem = await Item.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "პროდუქტი ვერ მოიძებნა" });
    }

    return res.status(200).json({
      success: true,
      message: "პროდუქტი წარმატებით განახლდა",
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

    const foundedItem = await Item.findById(id);

    if (!foundedItem) {
      return res
        .status(404)
        .json({ success: false, message: "პროდუქტი ვერ მოიძებნა" });
    }

    foundedItem.status = status;
    await foundedItem.save();

    return res.json({ success: true, foundedItem });
  } catch (error) {
    console.error("Error updating item status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// DELETE Item by id
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Item.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "პროდუქტი ვერ მოიძებნა" });
    }

    return res.status(200).json({
      success: true,
      message: "პროდუქტი წარმატებით წაიშალა",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET item by id
export const getItem = async (req, res) => {
  try {
    const { id } = req.params;

    const foundItem = await Item.findById(id);

    if (!foundItem) {
      return res
        .status(404)
        .json({ success: false, message: "პროდუქტი ვერ მოიძებნა" });
    }

    return res.status(200).json({
      success: true,
      item: foundItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET all Items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ dealDate: -1, createdAt: -1 });

    if (items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "პროდუქტები ვერ მოიძებნა",
        items: [],
      });
    }

    return res.status(200).json({ success: true, items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
