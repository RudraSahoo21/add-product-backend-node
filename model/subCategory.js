const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
  CategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categoryDetails" },
  index: { type: Number, require: true },
  name: { type: String, require: true },
});

const SubCategoryModel = mongoose.model(
  "SubCategorydetails",
  SubCategorySchema
);

module.exports = SubCategoryModel;
