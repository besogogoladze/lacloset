import mongoose from "mongoose";

// const TranslationSchema = new mongoose.Schema({
//   en: { type: String, required: true },
//   fr: { type: String, required: true },
//   geo: { type: String, required: true },
//   ru: { type: String, required: true },
// });

const itemSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      required: true,
    },
    priceInLari: {
      type: Number,
      required: true,
    },
    image_url: {
      type: String,
      required: false,
    },
    size: { type: String, required: true },
    status: { type: Boolean, required: false },
  },
  { timestamps: true },
);

const item = mongoose.model("item", itemSchema);
export default item;
