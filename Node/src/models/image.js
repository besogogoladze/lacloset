const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    filename: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
