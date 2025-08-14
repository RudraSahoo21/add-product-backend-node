const {
  createProdDetails,
  fetchProductAndPricingDetails,
  removeProductDetails,
  productDataForEdit,
  updatedProductDetails,
  fetchAllItems,
} = require("./productDetailsController");
const {
  CreatePriceingDetails,
  removePriceingDetails,
  updatedPriceingDetails,
} = require("./priceingController");
const {
  CreateScheduledDetails,
  removeScheduledDetails,
  updatedScheduledDetails,
} = require("./scheduledOrderController");
const {
  CreateInventoryDetails,
  removeInventoryDetails,
  updatedInventoryDetails,
} = require("./inventoryController");
const {
  CreateVariantList,
  removeVariantList,
  updateVariantList,
} = require("./VariantListController");
const { saveProductImages, removeImages } = require("./ImageController");
const priceingDetails = require("../model/priceing");
const {
  createNewProductAdddon,
  removeProductAddon,
} = require("../controller/productAddonController");

// Add a new product details in the database
const addNewProductDetails = async (req, res) => {
  try {
    const reqData = req.body;
    //extracting all the details
    console.log("Request data :- ", reqData);
    // price data extraction
    const PriceDetail = {
      mrp: reqData.mrp,
      packageingCharge: reqData.packageingCharge,
      purchaseCost: reqData.purchaseCost,
      sellingPrice: reqData.sellingPrice,
      tax: reqData.tax.id,
    };
    //schedule data extraction
    const scheduledDetail = {
      allow_scheduling: reqData.allow_scheduling,
      hour_gap: reqData.hour_gap,
      maxi_duration: reqData.maxi_duration,
      mini_duration: reqData.mini_duration,
    };
    // product addon list extraction
    const addonList = reqData.addOnListArray || [];

    // Inventory Data extraction
    const inventory = {
      Allow_Order: reqData.Allow_Order,
      sku: reqData.sku,
      Available_Stock: reqData.Available_Stock,
      Barcode_No: reqData.Barcode_No,
    };
    // variant list array data send to variant controller
    const variantList = reqData.variantGroups || [];

    //saveing the data into the corresponding collections ( productdetails , priceing)
    const savedProductDetails = await createProdDetails(reqData);
    PriceDetail.product_id = savedProductDetails._id;
    scheduledDetail.product_id = savedProductDetails._id;
    inventory.product_id = savedProductDetails._id;

    const savedPriceingDetails = await CreatePriceingDetails(PriceDetail);
    const savedScheduledDetail = await CreateScheduledDetails(scheduledDetail);
    const savedInventory = await CreateInventoryDetails(inventory);

    if (reqData.product_has_variants == true)
      variantList.forEach((variant) => {
        variant.product_id = savedProductDetails._id;
      });
    const saveVariantList = await CreateVariantList(variantList);
    if (reqData.product_has_variants == false) {
      addonList.forEach((addon) => {
        addon.product_id = savedProductDetails._id;
      });
      const savedProductAddon = await createNewProductAdddon(addonList);
    }

    // Pass images to productImageController
    const base64Images = reqData.imagePreviews || [];
    const savedImages = await saveProductImages(
      base64Images,
      savedProductDetails._id
    );

    // response
    res.status(201).json({
      message: "Product details saved successfully",
      product: savedProductDetails,
      priceing: savedPriceingDetails,
      schedule: savedScheduledDetail,
      Inventory: savedInventory,
      variantList: saveVariantList,
      images: savedImages,
    });
  } catch (error) {
    console.error("Failed to save product details:", error);
    res.status(500).json({ error: error.message });
  }
};

// featch the priceing details and image when page load
const fetchAllProductDetails = async (req, res) => {
  try {
    // Fetch combined product and pricing data
    const combinedData = await fetchProductAndPricingDetails();
    // Send the merged data to the frontend
    res.status(200).json({
      message: "Product and pricing details fetched successfully",
      success: true,
      data: combinedData,
    });
  } catch (error) {
    console.error("Error fetching combined product and pricing data:", error);
    res.status(500).json({ error: error.message });
  }
};

// remove product related all the details in all the related collection
const deleteSelectedProdDtl = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);
    await removeInventoryDetails(_id);
    await removeScheduledDetails(_id);
    await removeVariantList(_id);
    await removePriceingDetails(_id);
    await removeProductDetails(_id);
    await removeImages(_id);
    await removeProductAddon(_id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("error while deteleing the selected product details");
    res.status(500).json({ error: error.message });
  }
};

// sending data for edit
const dataForEdit = async (req, res) => {
  try {
    const { _id } = req.body;
    const combinedData = await productDataForEdit(_id);
    res.status(200).json({
      message: "Product and pricing details fetched successfully",
      success: true,
      data: combinedData,
    });
  } catch (error) {
    console.error("Error while sending the data towords form for edit");
    res.status(500).json({ error: error.message });
  }
};

// updated data changed and save in DB
const updatedData = async (req, res) => {
  try {
    // console.log("updated data :", req.body);
    const { _id, obj } = req.body;
    await updatedProductDetails(_id, obj);
    await updatedPriceingDetails(_id, obj);
    await updatedInventoryDetails(_id, obj);
    await updatedScheduledDetails(_id, obj);
    await updateVariantList(_id, obj.variantGroups);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log("error while updateing the edited data ");
    res.status(500).json({ error: error.message });
  }
};

/**
 * Below functions are for customer like food delivery app
 */

// fetch all items for customer
const fetchAllFoodItems = async (req, res) => {
  try {
    // Fetch combined product, priceng , images and all
    const combinedData = await fetchAllItems();
    // Send the merged data to the frontend
    res.status(200).json({
      message: "Product and pricing details fetched successfully",
      success: true,
      data: combinedData,
    });
  } catch (error) {
    console.error("Error fetching combined product and pricing data:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addNewProductDetails,
  fetchAllProductDetails,
  deleteSelectedProdDtl,
  dataForEdit,
  updatedData,
  fetchAllFoodItems,
};
