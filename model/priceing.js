const mongoose = require("mongoose");
const { Schema } = mongoose;

const priceingDetailsSchema = new Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "productDetails" },
  mrp: { type: String, default: null },
  packageingCharge: { type: String, default: null },
  purchaseCost: { type: String, default: null },
  sellingPrice: { type: String, default: null },
  tax: { type: mongoose.Schema.Types.ObjectId, ref: "Taxation" },
});

const priceingDetails = mongoose.model(
  "priceingDetails",
  priceingDetailsSchema
);

module.exports = priceingDetails;
