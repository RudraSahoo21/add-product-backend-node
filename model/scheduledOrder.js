const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduledDetailsSchema = new Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "productDetails" },
  allow_scheduling: { type: Boolean, default: false },
  hour_gap: { type: String, default: null },
  maxi_duration: { type: String, default: null },
  mini_duration: { type: String, default: null },
});

const scheduledDetails = mongoose.model(
  "scheduledDetails",
  scheduledDetailsSchema
);

module.exports = scheduledDetails;
