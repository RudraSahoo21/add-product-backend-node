const addOnDetails = require("../model/addOn");
const mongoose = require("mongoose");

const SearchAddOns = async (req, res) => {
  const { catagory, name } = req.body;
  // console.log();
  try {
    let list = {};
    if (!catagory) {
      list = await addOnDetails.find();
    }
    if (catagory && name) {
      list = await addOnDetails.find({
        catagory,
        name: { $regex: name, $options: "i" },
      });
    }
    if (catagory && !name) {
      list = await addOnDetails.find({ catagory });
    }
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// fetch addon list details on table
const fetchAddOn = async (req, res) => {
  try {
    const FindaddOns = await addOnDetails
      .find()
      .select("-__v")
      .sort({ index: 1 });
    res.status(200).json({
      success: true,
      message: "All taxation fetched successfully",
      data: FindaddOns,
    });
  } catch (error) {
    console.error("error in featching the taxation ammounts", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// add new addons on list ( Admin Portal )
const addnewAddons = async (req, res) => {
  try {
    const payload = req.body;
    const savedData = await new addOnDetails({
      ...payload,
    }).save();
    res.status(200).json({
      message: "new addon saved successfully",
      success: true,
      status: "success",
      data: savedData,
    });
  } catch (error) {
    console.log("Unable to add the addon data", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update the existing addons
const updateAddons = async (req, res) => {
  const payload = req.body;
  try {
    if (!payload._id) {
      return res.status(400).json({
        message: "bad request '_id' key is misssing",
        status: "danger",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(payload._id)) {
      return res.status(404).json({
        success: false,
        status: "danger",
        message: "Invalid ID format — AddOn not found",
      });
    }
    const existingAddons = await addOnDetails.findById(payload._id);
    console.log(existingAddons);
    if (!existingAddons) {
      return res.status(404).json({
        success: false,
        status: "danger",
        message: "AddOn data not Found",
      });
    }
    await addOnDetails.findByIdAndUpdate(payload._id, payload, { new: true });
    return res.status(200).json({
      success: true,
      status: "success",
      message: "AddOn updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove the existing addin record
const removeAddons = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      res.status(400).json({
        success: false,
        message: " Bad Request !! Id is not present in request body...",
      });
    }
    const deletedAddon = await addOnDetails.findByIdAndDelete(id);
    if (!deletedAddon) {
      return res.status(404).json({
        success: false,
        state: "danger",
        message: "Unable to find addon details ",
      });
    }
    res.status(200).json({
      success: true,
      state: "success",
      message: " Addon Details deleted successfully",
      data: deletedAddon,
    });
  } catch (error) {
    console.error("Error while deleteing the addon", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  SearchAddOns,
  fetchAddOn,
  addnewAddons,
  updateAddons,
  removeAddons,
};
