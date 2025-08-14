const express = require("express");
const router = express.Router();

// importing files for functions
const masterController = require("../controller/MasterController");
const menulabelController = require("../controller/menulabelController");
const variantListController = require("../controller/VariantListController");
const productAddonController = require("../controller/productAddonController");

router.post(
  "/featchedMenuLabelCustomer",
  menulabelController.featchedMenuLabelCustomer
);

// fetching all items
router.post("/fetchAllItems", masterController.fetchAllFoodItems);
// fetching variant with addons accordingly to their food items
router.post("/fetchVariant&Addons", variantListController.fetchvariantForCust);
// fetching product addon accordingly with there food  items
router.post("/fetchProductAddons", productAddonController.fetchProductAddon);

module.exports = router;
