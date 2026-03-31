import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    buyer: { type: String, required: true },
    soldItem: { type: String, required: true },
    description: { type: String, required: false },
    priceInLari: {
      type: Number,
      required: true,
    },
    priceInEuros: {
      type: Number,
      required: true,
    },
    pricePayedByClient: {
      type: Number,
      required: true,
    },
    priceOfTransport: {
      type: Number,
      required: true,
    },
    totalProfit: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true },
);

const item = mongoose.model("item", itemSchema);
export default item;
