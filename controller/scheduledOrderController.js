const mongoose = require("mongoose");
const scheduledDetails = require("../model/scheduledOrder");

const CreateScheduledDetails = async (scheduleDetails) => {
  try {
    const sd = await new scheduledDetails(scheduleDetails).save();
    return sd;
  } catch (error) {
    console.error("Error in adding new product schedule details data:", error);
    throw new Error("Failed in creation of priceing data: " + error.message);
  }
};

// remove product related scheduled list
const removeScheduledDetails = async (ProductId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      throw new Error("Invalid product ID");
    }
    await scheduledDetails.deleteMany({
      product_id: ProductId,
    });
  } catch (error) {
    console.error("Error deleting product Inventory:", error);
    throw new Error("Failed to delete product Inventory.");
  }
};

//// updateing the edited data of ScheduledOrder
const updatedScheduledDetails = async (_id, obj) => {
  try {
    const updatedScheduledData = {
      allow_scheduling: obj.allow_scheduling,
      hour_gap: obj.hour_gap,
      maxi_duration: obj.maxi_duration,
      mini_duration: obj.mini_duration,
    };
    const updatedScheduleOrder = await scheduledDetails.findOneAndUpdate(
      { product_id: _id },
      { $set: updatedScheduledData }
    );
    if (!updatedScheduleOrder) {
      throw new Error("ScheduleOrder data not found or not updated");
    }
    return updatedScheduleOrder;
  } catch (error) {
    console.error("Error in updateing ScheduleOrder Details:", error);
    throw new Error("Failed to Update ScheduleOrder details.");
  }
};

module.exports = {
  CreateScheduledDetails,
  removeScheduledDetails,
  updatedScheduledDetails,
};
