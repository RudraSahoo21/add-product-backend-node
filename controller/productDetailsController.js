const mongoose = require("mongoose");
const productDetails = require("../model/productDetails");
const priceingDetails = require("../model/priceing");
const inventoryDetails = require("../model/inventory");
const scheduledDetails = require("../model/scheduledOrder");
const VariantList = require("../model/VarientList");
const productImages = require("../model/productImages");
const ProductType = require("../model/ProductType");
const MenuLabel = require("../model/menulabel");
const variant = require("../model/VarientList");
const productAddon = require("../model/product_addon");

const createProdDetails = async (reqData) => {
  try {
    const productType = reqData.productType;
    // Find the product type (expecting one)
    const matchedType = await ProductType.findOne({ ProductType: productType });
    if (!matchedType) {
      throw new Error("Invalid Product Type: " + productType);
    }
    // product details data extraction
    const productDetail = {
      productName: reqData.productName,
      shortDescription: reqData.shortDescription,
      product_weight: reqData.product_weight,
      productType: matchedType._id,
      productStatus: reqData.productStatus,
      product_has_variants: reqData.product_has_variants,
      product_has_addOns: reqData.product_has_addOns,
      tagsArray: reqData.tagsArray,
      selectedLabel: reqData.selectedLabel,
      selectedCatagory: reqData.selectedCatagory,
      selectedSubCatagory: reqData.selectedSubCatagory,
    };
    const ProductDetails = await new productDetails(productDetail).save();
    return ProductDetails;
  } catch (error) {
    console.error("Error in adding new product details data:", error);
    throw new Error("User creation failed: " + error.message);
  }
};

//fatch all the products
const fetchProductAndPricingDetails = async () => {
  try {
    // Fetch all products and their associated pricing details
    const products = await productDetails.find({}).select().lean();

    // Populate pricing details using the product_id
    const productsWithPricing = await Promise.all(
      products.map(async (product) => {
        const productType = await ProductType.findById(
          product.productType
        ).lean();
        const pricing = await priceingDetails
          .findOne({ product_id: product._id })
          .lean();
        const inventory = await inventoryDetails
          .findOne({ product_id: product._id })
          .lean();
        const imageDocs = await productImages
          .find({ product_id: product._id })
          .select("-_id -product_id -__v")
          .lean();
        const images = imageDocs.flatMap((doc) => doc.images || []);
        // Combine product details with pricing details
        return {
          productName: product.productName,
          productId: product._id,
          productType: productType.ProductType || "Unknow",
          mrp: pricing.mrp,
          packageingCharge: pricing.packageingCharge,
          purchaseCost: pricing.purchaseCost,
          Available_Stock: inventory?.Available_Stock || 0,
          images: images,
        };
      })
    );
    return productsWithPricing;
  } catch (error) {
    console.error("Error fetching product and pricing details:", error);
    throw new Error("Failed to fetch details.");
  }
};

// remove product details
const removeProductDetails = async (ProductId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      throw new Error("Invalid product ID");
    }
    const deletedProduct = await productDetails.findByIdAndDelete(ProductId);
    if (!deletedProduct) {
      console.warn("No product found with this ID.");
    } else {
      console.log("Deleted product:", deletedProduct);
    }
    // return deletedProduct;
  } catch (error) {
    console.error("Error deleting product details:", error);
    throw new Error("Failed to delete product details.");
  }
};

// sending the data for edit
const productDataForEdit = async (_id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error("Invalid product ID");
    }
    const [
      product,
      pricing,
      inventory,
      schedule,
      imageDocs,
      rawVariants,
      productAddons,
    ] = await Promise.all([
      productDetails
        .findById({ _id })
        .select("-__v -_id -createdAt -updatedAt")
        .lean(),
      priceingDetails.findOne({ product_id: _id }).select("-__v -_id").lean(),
      inventoryDetails.findOne({ product_id: _id }).select("-__v -_id").lean(),
      scheduledDetails.findOne({ product_id: _id }).select("-__v -_id").lean(),
      productImages
        .find({ product_id: _id })
        .select("-__v -_id -product_id")
        .lean(),
      VariantList.find({ product_id: _id }).select("-__v -product_id").lean(),
      productAddon.find({ product_id: _id }).select("-v -product_id").lean(),
    ]);
    if (!product) {
      throw new Error("Product not found");
    }
    // sending product type name to clientside
    const prodTypeName = await ProductType.findById(product.productType);
    const transformedVariants = rawVariants.map((variant) => ({
      ...variant,
      ...variant.dynamicFields, // Flatten dynamic fields into top-level
      dynamicFields: undefined, // Remove the original key (optional)
    }));

    // Merge all fields into one object (spread syntax)
    return {
      ...product,
      productType: prodTypeName.ProductType, //overrideing product type name instate of id
      ...pricing,
      ...inventory,
      ...schedule,
      imagePreviews: imageDocs.flatMap((img) => img.images || []),
      variantGroups: transformedVariants, // keep variants as array under its own key
      addOnListArray: productAddons,
    };
  } catch (error) {
    console.error("Error fetching product details for edit:", error);
    throw new Error("Failed to fetch product details.");
  }
};

// updateing the edited data
const updatedProductDetails = async (_id, obj) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error("Invalid product ID");
  }

  // Find the product type (expecting one)
  const matchedType = await ProductType.findOne({
    ProductType: obj.productType,
  });
  if (!matchedType) {
    throw new Error("Invalid Product Type: " + obj.productType);
  }
  console;

  const updatedProdData = {
    productName: obj.productName,
    shortDescription: obj.shortDescription,
    product_weight: obj.product_weight,
    productType: matchedType._id,
    productStatus: obj.productStatus,
    product_has_variants: obj.product_has_variants,
    product_has_addOns: obj.product_has_addOns,
    tagsArray: obj.tagsArray,
    selectedLabel: obj.selectedLabel,
    selectedCatagory: obj.selectedCatagory,
    selectedSubCatagory: obj.selectedSubCatagory,
  };
  const updatedProduct = await productDetails.findByIdAndUpdate(
    _id,
    updatedProdData
  );
  if (!updatedProduct) {
    throw new Error("Product not found or not updated");
  }
  return updatedProduct;
};

// featching items for customer side app(food delivery)
const fetchAllItems = async () => {
  try {
    const products = await productDetails.find({}).select().lean();
    const productWithDetails = await Promise.all(
      products.map(async (product) => {
        const productType = await ProductType.findById(
          product.productType
        ).lean();
        const pricing = await priceingDetails
          .findOne({ product_id: product._id })
          .lean();
        const inventory = await inventoryDetails
          .findOne({ product_id: product._id })
          .lean();
        const menuLabel = await MenuLabel.findById(product.selectedLabel)
          .select("_id label")
          .lean();
        const variantCount = await variant.countDocuments({
          product_id: product._id,
        });
        const productAddonCount = await productAddon.countDocuments({
          product_id: product._id,
        });

        const imageDocs = await productImages
          .find({ product_id: product._id })
          .select("-_id -product_id -__v")
          .lean();
        const images = imageDocs.flatMap((doc) => doc.images || []);
        // Combine product details with pricing details
        return {
          productName: product.productName,
          productId: product._id,
          productType: productType.ProductType || "Unknow",
          menu: menuLabel,
          description: product.shortDescription,
          mrp: pricing.mrp,
          variantCount: variantCount,
          productAddonCount: productAddonCount,
          Available_Stock: inventory?.Available_Stock || 0,
          images: images,
        };
      })
    );
    return productWithDetails;
  } catch (error) {
    console.error("Error fetching item details:", error);
    throw new Error("Failed to fetch details.");
  }
};

module.exports = {
  createProdDetails,
  fetchProductAndPricingDetails,
  removeProductDetails,
  productDataForEdit,
  updatedProductDetails,
  fetchAllItems,
};
