const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "productDetails" },
  images: { type: [String], default: [] },
});

const imageModal = mongoose.model("productImages", imageSchema);

module.exports = imageModal;
