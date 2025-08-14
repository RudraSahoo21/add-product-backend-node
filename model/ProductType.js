const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductTypeSchema = new Schema({
  ProductType: { type: String, require: true },
});

const ProductType = mongoose.model("ProductType", ProductTypeSchema);

module.exports = ProductType;
