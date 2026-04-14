import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    buyer: { type: String, required: true },
    soldItem: { type: String, required: true },
    description: { type: String, required: false },
    priceInLari: { type: Number, required: true },
    priceInEuros: { type: Number, required: true },
    pricePayedByClient: { type: Number, required: true },
    priceOfTransport: { type: Number, required: true },
    totalProfit: { type: Number, required: false },
    dealDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

const Item = mongoose.model("item", itemSchema);
export default Item;
