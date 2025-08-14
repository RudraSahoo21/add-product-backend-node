const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  index: { type: Number, require: true },
  name: { type: String, require: true },
});

const CategoryModel = mongoose.model("categoryDetails", CategorySchema);

module.exports = CategoryModel;
