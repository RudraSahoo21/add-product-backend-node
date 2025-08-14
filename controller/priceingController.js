const mongoose = require("mongoose");
const priceingDetails = require("../model/priceing");

// create Priceing related to product
const CreatePriceingDetails = async (PriceDetail) => {
  try {
    const PriceDetails = await new priceingDetails(PriceDetail).save();
    return PriceDetails;
  } catch (error) {
    console.error("Error in adding new product priceing details data:", error);
    throw new Error("Failed in creation of priceing data: " + error.message);
  }
};

// delete priceing details related to product
const removePriceingDetails = async (ProductId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      throw new Error("Invalid product ID");
    }
    await priceingDetails.deleteMany({
      product_id: ProductId,
    });
  } catch (error) {
    console.error("Error deleting product Inventory:", error);
    throw new Error("Failed to delete product Inventory.");
  }
};

// updateing the edited data of priceing
const updatedPriceingDetails = async (_id, obj) => {
  const updatedPriceingData = {
    mrp: obj.mrp,
    packageingCharge: obj.packageingCharge,
    purchaseCost: obj.purchaseCost,
    sellingPrice: obj.sellingPrice,
    tax: obj.tax.id,
  };
  const updatedPriceing = await priceingDetails.findOneAndUpdate(
    { product_id: _id },
    { $set: updatedPriceingData }
  );
  if (!updatedPriceing) {
    throw new Error("Pricing data not found or not updated");
  }
  return updatedPriceing;
};

module.exports = {
  CreatePriceingDetails,
  removePriceingDetails,
  updatedPriceingDetails,
};
