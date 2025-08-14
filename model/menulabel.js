const mongoose = require("mongoose");
const { Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const MenuLabelSchema = new Schema({
  index: Number,
  label: { type: String, required: true },
});

// Attach the plugin to auto-increment the 'index' field
MenuLabelSchema.plugin(AutoIncrement, { inc_field: "index" });

const MenuLabel = mongoose.model("MenuLabel", MenuLabelSchema);

module.exports = MenuLabel;
