const mongoose = require("mongoose");
const { Schema } = mongoose;

const addonSchema = new Schema({
  catagory: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, requiredq: true },
  price: { type: Number, require: true },
  tax: { type: Number, require: true },
});

const addOnDetails = mongoose.model("addon_Details", addonSchema);

module.exports = addOnDetails;
