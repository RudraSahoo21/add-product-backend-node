const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const imageModal = require("../model/productImages");

const saveProductImages = async (base64Images, productId) => {
  try {
    if (!base64Images || base64Images.length === 0) {
      console.log("No image base64 data provided");
      return [];
    }

    const savedImagePaths = [];

    for (const base64 of base64Images) {
      const matches = base64.match(/^data:(.+);base64,(.+)$/);

      if (!matches) {
        console.error("Invalid base64 string");
        continue;
      }

      const ext = matches[1].split("/")[1]; // 'image/png' → 'png'
      const data = matches[2];
      const buffer = Buffer.from(data, "base64");

      const fileName = `${Date.now()}-${Math.round(
        Math.random() * 1e5
      )}.${ext}`;
      const filePath = path.join(__dirname, "..", "Images", fileName);

      fs.writeFileSync(filePath, buffer);
      savedImagePaths.push(fileName);
    }

    // Save image names to DB
    const imageDoc = new imageModal({
      product_id: productId,
      images: savedImagePaths,
    });

    const saved = await imageDoc.save();
    return saved;
  } catch (error) {
    console.error("Error saving base64 images:", error);
    throw error;
  }
};

// Remove Images
const removeImages = async (ProductId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      throw new Error("Invalid product ID");
    }
    await imageModal.deleteMany({
      product_id: ProductId,
    });
  } catch (error) {
    console.error("Error in removeing images :", error);
    throw new Error("Failed to delete product Images.");
  }
};

module.exports = { saveProductImages, removeImages };
