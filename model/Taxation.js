const mongoose = require("mongoose");
const { Schema } = mongoose;

const tatationSchema = new Schema({
  TaxationName: { type: String, required: true },
  TaxationRate: { type: Number, required: true },
});

const TaxationDetails = mongoose.model("Taxation", tatationSchema);

module.exports = TaxationDetails;
