const mongoose = require("mongoose");
const TaxationDetails = require("../model/Taxation");

// Add new tax rates
const addNewTax = async (req, res) => {
  const { taxName, taxRate } = req.body;
  try {
    if (!taxName || typeof taxName != "string") {
      console.error("Invalid Taxation Name");
      res
        .status(403)
        .json({ success: false, message: "Invalid Taxation Name" });
    }
    if (!taxRate || typeof taxRate != "number") {
      console.error("Invalid Taxation Rate");
      res
        .status(403)
        .json({ success: false, message: "Invalid Taxation Rate" });
    }
    const newTax = new TaxationDetails({
      TaxationName: taxName,
      TaxationRate: taxRate,
    });
    await newTax.save();

    res.status(201).json({
      success: true,
      message: "New Taxation Data added successfully",
      data: newTax,
    });
  } catch (error) {
    console.error("Error on adding new tax rate", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// featch all the tax list
const featchAllTaxes = async (req, res) => {
  try {
    const findtaxes = await TaxationDetails.find()
      .select("-__v")
      .sort({ index: 1 });
    res.status(200).json({
      success: true,
      message: "All taxation fetched successfully",
      data: findtaxes,
    });
  } catch (error) {
    console.error("error in featching the taxation ammounts", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//Edit Tax list
const editTaxes = async (req, res) => {
  try {
    const { id, TaxationName, TaxationRate } = req.body;
    const updateData = {
      TaxationName,
      TaxationRate,
    };
    const updatedTax = await TaxationDetails.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTax) {
      return res.status(404).json({ success: false, message: "Tax not found" });
    }
    res.status(200).json({
      success: true,
      message: "Tax updated successfully",
      data: updatedTax,
    });
  } catch (error) {
    console.error("Error updating tax:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// delete selected tax
const removeTax = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      res.status(400).json({
        success: false,
        message: " Bad Request !! Id is not present in request body...",
      });
    }
    const deletedTax = await TaxationDetails.findByIdAndDelete(id);
    if (!deletedTax) {
      return res.status(404).json({ success: false, message: "Tax not found" });
    }
    res.status(200).json({
      success: true,
      message: "Tax deleted successfully",
      data: deletedTax,
    });
  } catch (error) {
    console.error("Error while deleteing the tax", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { addNewTax, featchAllTaxes, editTaxes, removeTax };
