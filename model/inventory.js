const mongoose = require("mongoose");
const { Schema } = mongoose;

const InventoryDetailsSchema = new Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "productDetails" },
  Allow_Order: { type: Boolean, default: false },
  sku: { type: String, default: null },
  Available_Stock: { type: Number, default: 0 },
  Barcode_No: { type: String, default: null },
});

const InventoryDetails = mongoose.model(
  "InventoryDetails",
  InventoryDetailsSchema
);

module.exports = InventoryDetails;
