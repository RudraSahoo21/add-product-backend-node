const mongoose = require("mongoose");
const { Schema } = mongoose;

const userLocationSchema = new Schema({
  UserId: { type: String, required: true },
  placeName: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

userLocationSchema.index({ location: "2dsphere" });

const userLocation = mongoose.model("userLocations", userLocationSchema);

module.exports = userLocation;
