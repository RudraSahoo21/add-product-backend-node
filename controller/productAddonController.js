const productAddon = require("../model/product_addon");
const mongoose = require("mongoose");

// crete product addOn
const createNewProductAdddon = async (productAddonList) => {
  try {
    // console.log("product Addon List", productAddonList);
    const newProductAddon = await productAddon.create(productAddonList);
    console.log("Successfully saved:", newProductAddon);
    return newProductAddon;
  } catch (error) {
    console.error("Error saving product add-ons:", error.message);
    throw error;
  }
};

// Delete Product Addon when delete the variant
const removeProductAddon = async (ProductId) => {
  try {
    // Validate the productId
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      throw new Error("Invalid product ID");
    }
    const result = await productAddon.deleteMany({ product_id: ProductId });
    return result;
  } catch (error) {
    console.error("Error deleting variant list:", error);
    throw new Error("Failed to delete variant list.");
  }
};

// fetching product addon data for the customer according to there food
const fetchProductAddon = async (req, res) => {
  const { product_id } = req.body;
  try {
    const productAddonList = await productAddon.find({
      product_id: product_id,
    });
    if (!productAddonList || productAddonList.length === 0) {
      return res.status(404).json({
        success: false,
        count: productAddonList.length,
        message: "No addon found for this product.",
      });
    }
    res
      .status(200)
      .json({
        success: true,
        count: productAddonList.length,
        data: productAddonList,
      });
  } catch (error) {
    console.error("Error fetching product Addons:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createNewProductAdddon,
  removeProductAddon,
  fetchProductAddon,
};
