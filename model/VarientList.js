const mongoose = require("mongoose");
const { Schema } = mongoose;

const variantAddonSchema = new Schema({
  addonCategory: { type: String, required: true },
  addonName: { type: String, required: true },
  description: { type: String, required: true },
  addonPrice: { type: Number, required: true },
  taxPercentage: { type: Number, required: true },
  taxrate: { type: Number, required: true },
  type: { type: String, required: true },
});

const variantListSchema = new Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "productDetails" },
  VariantName: { type: String, default: null },
  sku: { type: String, default: null },
  Stock: { type: String, default: null },
  MRP: { type: String, default: null },
  Price: { type: String, default: null },
  selectedOption: { type: String, default: null },
  sellingPrice: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  packagingCharge: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  dynamicFields: { type: Map, of: Schema.Types.Mixed, default: {} },
  variantAddOns: { type: [variantAddonSchema], default: [] },
});

const VariantList = mongoose.model("VariantList", variantListSchema);

module.exports = VariantList;
