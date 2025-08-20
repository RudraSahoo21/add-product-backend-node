const mongoose = require("mongoose");
const { Schema } = mongoose;

const placesSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

placesSchema.index({ location: "2dsphere" });

const placeLocation = mongoose.model("placeLocations", placesSchema);

module.exports = placeLocation;
