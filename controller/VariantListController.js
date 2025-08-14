const mongoose = require("mongoose");
const VariantList = require("../model/VarientList");

// add variant list data
const CreateVariantList = async (variantListArray) => {
  try {
    // Step 1: Transform each variant to separate dynamicFields
    const transformedVariants = variantListArray.map((variant) => {
      // Destructure known fields
      const {
        product_id,
        VariantName,
        sku,
        Stock,
        MRP,
        Price,
        selectedOption,
        sellingPrice,
        commission,
        tax,
        packagingCharge,
        totalCost,
        variantAddOns,
        ...dynamicFieldsRaw // remaining keys go to dynamicFields
      } = variant;

      return {
        product_id,
        VariantName,
        sku,
        Stock,
        MRP,
        Price,
        selectedOption,
        sellingPrice,
        commission,
        tax,
        packagingCharge,
        totalCost,
        variantAddOns: variantAddOns || [],
        dynamicFields: new Map(Object.entries(dynamicFieldsRaw)),
      };
    });
    const savedVariants = await VariantList.insertMany(transformedVariants);
    return savedVariants;
  } catch (error) {
    console.error("Error saving variant list:", error);
    throw new Error("Failed to save variant list.");
  }
};

// remove all variant list data when the entire product delete
const removeVariantList = async (ProductId) => {
  try {
    // Validate the productId
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      throw new Error("Invalid product ID");
    }
    const result = await VariantList.deleteMany({ product_id: ProductId });
    console.log(
      `${result.deletedCount} variant(s) deleted for product ID: ${ProductId}`
    );
    return result;
  } catch (error) {
    console.error("Error deleting variant list:", error);
    throw new Error("Failed to delete variant list.");
  }
};

// Update variant list data
const updateVariantList = async (Prod_id, variantGroups) => {
  console.log("Prod_id", Prod_id, "variantGroups", variantGroups);
  const staticFields = [
    "VariantName",
    "sku",
    "Stock",
    "MRP",
    "Price",
    "selectedOption",
    "sellingPrice",
    "commission",
    "tax",
    "packagingCharge",
    "totalCost",
    "variantAddOns",
  ];
  // 1. Get all existing variants for this product
  const existingVariants = await VariantList.find({ product_id: Prod_id });

  // 2. Extract IDs from incoming data
  const incomingIds = variantGroups
    .filter((v) => v._id)
    .map((v) => v._id.toString());

  // 3. Identify variants to delete (those in DB but not in incoming)
  const variantsToDelete = existingVariants.filter(
    (v) => !incomingIds.includes(v._id.toString())
  );

  // 4. Delete removed variants
  for (const variant of variantsToDelete) {
    console.log("Deleting removed variant with ID:", variant._id);
    await VariantList.findByIdAndDelete(variant._id);
  }

  // processing the remaining variants
  for (const variant of variantGroups) {
    console.log("Processing variant:", variant);
    const { _id, ...allFields } = variant;
    const dynamicFields = {};
    const fieldsToUpdate = {};
    for (const key in allFields) {
      if (staticFields.includes(key)) {
        fieldsToUpdate[key] = allFields[key];
        console.log("Static", key);
      } else {
        dynamicFields[key] = allFields[key];
        console.log("Dynamic", key);
      }
    }
    fieldsToUpdate.dynamicFields = dynamicFields;
    if (_id) {
      console.log("Updating variant with ID:", _id);
      console.log("fieldsToUpdate:", fieldsToUpdate);
      try {
        await VariantList.findByIdAndUpdate(
          _id,
          { $set: fieldsToUpdate },
          { new: true }
        );
      } catch (err) {
        console.error(` Error updating variant with ID ${_id}:`, err.message);
      }
    } else {
      console.log(" This is a new variant (no _id present)");
      try {
        variant.product_id = Prod_id;
        await CreateVariantList([variant]); // passing the object to create a new variant
      } catch (err) {
        console.error(" Error creating new variant:", err.message);
      }
    }
  }
};

// fetching variant data for customer accordingly to their food
const fetchvariantForCust = async (req, res) => {
  const { product_id } = req.body;
  try {
    const variantList = await VariantList.find({
      product_id: product_id,
    }).select(
      "_id product_id VariantName Price selectedOption dynamicFields variantAddOns  "
    );

    if (!variantList || variantList.length === 0) {
      return res.status(404).json({
        success: false,
        count: variantList.length,
        message: "No variants found for this product.",
      });
    }
    res
      .status(200)
      .json({ success: true, count: variantList.length, data: variantList });
  } catch (error) {
    console.error("Error fetching variants:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  CreateVariantList,
  removeVariantList,
  updateVariantList,
  fetchvariantForCust,
};
