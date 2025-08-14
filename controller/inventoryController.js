const mongoose = require("mongoose");
const InventoryDetails = require("../model/inventory");

const CreateInventoryDetails = async (Inventory) => {
  try {
    const inven = await new InventoryDetails(Inventory).save();
    return inven;
  } catch (error) {
    console.error("Error in adding new product Inventory details data:", error);
    throw new Error("Failed in creation of priceing data: " + error.message);
  }
};

//  remove  product related inventory
const removeInventoryDetails = async (ProductId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      throw new Error("Invalid product ID");
    }
    await InventoryDetails.deleteMany({
      product_id: ProductId,
    });
  } catch (error) {
    console.error("Error deleting product Inventory:", error);
    throw new Error("Failed to delete product Inventory.");
  }
};

//// updateing the edited data of Inventory
const updatedInventoryDetails = async (_id, obj) => {
  try {
    const updatedInvData = {
      Allow_Order: obj.Allow_Order,
      sku: obj.sku,
      Available_Stock: obj.Available_Stock,
      Barcode_No: obj.Barcode_No,
    };
    const updatedInventory = await InventoryDetails.findOneAndUpdate(
      { product_id: _id },
      { $set: updatedInvData }
    );
    if (!updatedInventory) {
      throw new Error("Pricing data not found or not updated");
    }
    return updatedInventory;
  } catch (error) {
    console.error("Error in updateing Inventory Details:", error);
    throw new Error("Failed to Update Inventory details.");
  }
};

module.exports = {
  CreateInventoryDetails,
  removeInventoryDetails,
  updatedInventoryDetails,
};
