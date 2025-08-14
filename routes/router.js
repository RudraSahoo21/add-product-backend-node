const express = require("express");
const router = express.Router();
const MasterController = require("../controller/MasterController");
const menulabelController = require("../controller/menulabelController");
const categoryController = require("../controller/categoryController");
const addOnController = require("../controller/addOnController");
const ProductTypeController = require("../controller/ProductTypeController");
const taxation = require("../controller/TaxationController");
// access Permissions
const acessController = require("../controller/ConfigControllers/AccessController");
const accessPortalController = require("../controller/ConfigControllers/Access-Portal-Controller");

// Middleware
const tokenVerification = require("../middleware/jwt");
const authorizePermission = require("../middleware/CheckRole");

router.post("/addProductDetails", MasterController.addNewProductDetails); // adding new product details
router.post("/allProdDetails", MasterController.fetchAllProductDetails); // featching details for table when page load
router.delete("/deleteProd", MasterController.deleteSelectedProdDtl); //delete all product details
router.post("/update", MasterController.dataForEdit); // sending the towords file for an update
router.patch("/updateDetails", MasterController.updatedData); // update the DB with updated database
/*
 *************************************************************************************************
 *************************************************************************************************
 ********************  Below APIs are adding new elements to list  *******************************
 *************************************************************************************************
 *************************************************************************************************
 */

// Adding and fetching category details on category collection
router.post("/NewcategoryList", categoryController.addCategoryDetails);
router.post("/featchAllCategory", categoryController.fetchAllCategoryDetails);
// Adding and Fetching Sub-Category details on SubCategory collection
router.post("/NewSubcategoryList", categoryController.addSubCategoryDetails);
router.post(
  "/fetchAllSubCategory",
  categoryController.fetchAllSubCategoryDetails
);
// Adding addon details
router.post("/searchAddons", addOnController.SearchAddOns);
// adding Product Type
router.post("/addProdType", ProductTypeController.addProdType);

/* taxation */
// adding new taxes
router.post(
  "/addnewtaxes",
  tokenVerification,
  authorizePermission("create_taxation"),
  taxation.addNewTax
);
// featch all the taxes
router.post(
  "/featchTaxes",
  tokenVerification,
  authorizePermission("view_taxation"),
  taxation.featchAllTaxes
);
// edit tax list
router.patch(
  "/editTax",
  tokenVerification,
  authorizePermission("update_taxation"),
  taxation.editTaxes
);
// Remove Tax
router.delete(
  "/deletetax",
  tokenVerification,
  authorizePermission("delete_taxation"),
  taxation.removeTax
);

/* Catagory and Sub-Catagory */
router.post(
  "/addCatSubcat",
  tokenVerification,
  authorizePermission("view_category"),
  categoryController.combinedCatList
);

/* Menu Label */
// Adding and fetching menu Label details on MenuLabel collection
router.post(
  "/NewMenuLabel",
  tokenVerification,
  authorizePermission("create_menulabel"),
  menulabelController.addNewMenuLabel
);
router.post(
  "/featchAllMenuLabel",
  tokenVerification,
  authorizePermission("view_menulabel"),
  menulabelController.featchedMenuLabel
);
// edit menu label name
router.patch(
  "/editmenulabel",
  tokenVerification,
  authorizePermission("update_menulabel"),
  menulabelController.updateMenuLabel
);
// remove menulabel
router.delete(
  "/removeMenuLabel",
  tokenVerification,
  authorizePermission("delete_menulabel"),
  menulabelController.removeMenuLabel
);

/* AddOn List */
// fetch all list
router.post(
  "/fetchAllAddons",
  tokenVerification,
  authorizePermission("view_addon"),
  addOnController.fetchAddOn
);
// add new addons
router.post(
  "/addAddons",
  tokenVerification,
  authorizePermission("create_addon"),
  addOnController.addnewAddons
);
// update existing addons
router.patch(
  "/updateAddons",
  tokenVerification,
  authorizePermission("update_addon"),
  addOnController.updateAddons
);
// remove existing addons
router.delete(
  "/removeAddon",
  tokenVerification,
  authorizePermission("delete_addon"),
  addOnController.removeAddons
);

/*  Catagory and  SubCAtagory  */
// 1. add
router.post("/addCatagory&SubCatagory", categoryController.addCatSubcatData);

// access permissions and roles (adding)
router.post("/PermissionAdding", acessController.createNewPermission);
router.post("/RoleAdding", acessController.createNewRole);
router.post("/UserCreation", acessController.createNewUser);
router.post("/SignIn", acessController.login);

// Access-Portal UI permission APIs
router.post("/admin/allusers", accessPortalController.fetchAllUsers);
router.patch(
  "/updateUserPermission",
  accessPortalController.updateUserPermission
);

module.exports = router;
