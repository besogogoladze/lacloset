const express = require("express");
const upload = require("../middlewares/images/upload");
const {
  validateImageUpload,
} = require("../middlewares/validators/imageValidator");
const {
  uploadImage,
  getAllImages,
  deleteImage,
} = require("../controllers/images");

const router = express.Router();

// GET all images
router.get("/", getAllImages);

// POST upload image
router.post("/upload", upload.single("file"), validateImageUpload, uploadImage);

// DELETE image by ID
router.delete("/:id", deleteImage);

module.exports = router;
