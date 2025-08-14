const mongoose = require("mongoose");
const { Schema } = mongoose;

const productAddonSchema = new Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "productDetails" },
    addonCategory: { type: String, required: true },
    addonName: { type: String, required: true },
    description: { type: String, required: true },
    addonPrice: { type: Number, required: true },
    taxPercentage: { type: Number, required: true },
    taxrate: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const productAddonList = mongoose.model("prductAddons", productAddonSchema);

// exports
module.exports = productAddonList;
