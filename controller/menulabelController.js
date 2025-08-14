const mongoose = require("mongoose");
const MenuLabel = require("../model/menulabel");

// adding new menu Labels
const addNewMenuLabel = async (req, res) => {
  try {
    const { label } = req.body;
    const labels = await new MenuLabel({
      label: label, // label becomes the name
    }).save();
    res.status(201).json({
      success: true,
      message: "Menu label added successfully",
      data: labels,
    });
  } catch (error) {
    console.error("Unable to load the new menu label", error);
    res.status(500).json({
      success: false,
      message: "Failed to add new menu label",
    });
  }
};

// Fetching menu labels when the form loads
const featchedMenuLabel = async (req, res) => {
  try {
    const labels = await MenuLabel.find().select("-__v").sort({ index: 1 });
    res.status(200).json({
      success: true,
      message: "All menu labels fetched successfully",
      data: labels,
    });
  } catch (error) {
    console.error("Unable to fetch the menu label server data", error);
    res.status(500).json({ error: error.message });
  }
};

// edit menu labels
const updateMenuLabel = async (req, res) => {
  try {
    const { id, label } = req.body;
    const existingLabel = await MenuLabel.findById(id);
    // checking menulabel is present or not
    if (!existingLabel) {
      return res
        .status(404)
        .json({ success: false, message: "Menu label not found" });
    }
    // Check if the new name is the same as existing
    if (existingLabel.label === label) {
      return res.status(200).json({
        success: false,
        status: "warning",
        message:
          "The new name is the same as the existing name. No update performed.",
      });
    }
    // update the name
    const updatedMenuLabel = await MenuLabel.findByIdAndUpdate(
      id,
      { label },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      status: "success",
      message: "Menu label updated successfully",
      data: updatedMenuLabel,
    });
  } catch (error) {
    console.error("Error updating menu label:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Menu Label
const removeMenuLabel = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      res.status(400).json({
        success: false,
        message: " Bad Request !! Id is not present in request body...",
      });
    }
    const deletedMenuLabel = await MenuLabel.findByIdAndDelete(id);
    if (!deletedMenuLabel) {
      return res
        .status(404)
        .json({ success: false, message: "Menu Label not found" });
    }
    res.status(200).json({
      success: true,
      message: "Menu Label deleted successfully",
      data: deletedMenuLabel,
    });
  } catch (error) {
    console.error("Error while deleteing the Menulabel", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Controllers for FoodDelivery App apis
 */

//Fetch menu lable when page load
const featchedMenuLabelCustomer = async (req, res) => {
  try {
    const labels = await MenuLabel.find()
      .select("-__v -index")
      .sort({ index: 1 });
    res.status(200).json({
      success: true,
      message: "All menu labels fetched successfully",
      data: labels,
    });
  } catch (error) {
    console.error("Unable to fetch the menu label server data", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addNewMenuLabel,
  featchedMenuLabel,
  updateMenuLabel,
  removeMenuLabel,
  featchedMenuLabelCustomer,
};
