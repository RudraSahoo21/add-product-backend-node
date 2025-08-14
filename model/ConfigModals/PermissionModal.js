const mongoose = require("mongoose");

// Define schema
const PermissionSchema = new mongoose.Schema(
  {
    permissionName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const PermissionDetails = mongoose.model("PermissionDetails", PermissionSchema);

// Export the model
module.exports = PermissionDetails;
