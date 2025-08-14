const mongoose = require("mongoose");

// define schema
const userSchema = new mongoose.Schema(
  {
    UserName: { type: String, required: true, trim: true },
    UserEmail: {
      type: String,
      unique: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Password should have at least 8 characters
      trim: true,
    },
    Role: {
      type: mongoose.Schema.ObjectId,
      ref: "RoleDetails",
      required: true,
    },
    customPermissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PermissionDetails" },
    ],
  },
  {
    timestamps: true,
  }
);

// define modal
const UserDetails = mongoose.model("UserDetails", userSchema);

module.exports = UserDetails;
