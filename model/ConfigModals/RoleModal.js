const mongoose = require("mongoose");

// Define Schema
const RoleSchema = new mongoose.Schema(
  {
    RoleName: { type: String, required: true, trim: true },
    RolePermissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PermissionDetails" },
    ],
  },
  {
    timestamps: true,
  }
);

// define Modal
const RoleDetails = mongoose.model("RoleDetails", RoleSchema);

module.exports = RoleDetails;
