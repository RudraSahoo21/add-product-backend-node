const mongoose = require("mongoose");
const { Schema } = mongoose;

const productDetailsSchema = new Schema(
  {
    productName: { type: String, required: true, default: "" },
    shortDescription: { type: String, default: null },
    product_weight: { type: String, default: null },
    productType: { type: mongoose.Schema.Types.ObjectId, ref: "ProductType" },
    productStatus: { type: Boolean, default: false },
    product_has_variants: { type: Boolean, default: false },
    product_has_addOns: { type: Boolean, default: false },
    tagsArray: [String],
    selectedLabel: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuLabel" }],
    selectedCatagory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categoryDetails",
    },
    selectedSubCatagory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategorydetails",
    },
  },
  { timestamps: true }
);

const productDetails = mongoose.model("productDetails", productDetailsSchema);

//export
module.exports = productDetails;
