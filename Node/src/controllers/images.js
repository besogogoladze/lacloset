const fs = require("fs");
const path = require("path");
const Image = require("../models/image");

// POST /api/images/upload
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "You must select a valid image file." });
    }

    const imgUrl = `/file/${req.file.filename}`;

    const newImage = new Image({
      title: req.body.title || null,
      description: req.body.description || null,
      filename: req.file.filename,
      imageUrl: imgUrl,
      size: req.file.size,
      originalName: req.file.originalname,
    });

    await newImage.save();

    return res.status(201).json({
      message: "Image uploaded successfully.",
      image: newImage,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return res
      .status(500)
      .json({ message: "Server error while uploading image." });
  }
};

// GET /api/images
const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    return res.status(200).json({
      count: images.length,
      images,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching images." });
  }
};

// DELETE /api/images/:id
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    const filePath = path.join(__dirname, "../uploads", image.filename);

    // Delete file from disk if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.deleteOne();

    return res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting image." });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  deleteImage,
};
