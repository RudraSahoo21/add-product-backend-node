const ProductType = require("../model/ProductType");

// add product type details
const addProdType = async (req, res) => {
  try {
    const { ProdType } = req.body;

    // if product type is not present
    if (!ProdType) {
      return res.status(400).json({
        success: false,
        message: "Product type is required",
      });
    }

    const addNewProdType = await ProductType.create({
      ProductType: ProdType,
    });
    console.log("New Product Type Is Added");
    res.status(200).json({
      success: true,
      message: "New Prod Type added succesfully...",
      data: addNewProdType,
    });
  } catch (error) {
    console.error(" Unable to load the Product Type ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add new menu label",
    });
  }
};

module.exports = { addProdType };
