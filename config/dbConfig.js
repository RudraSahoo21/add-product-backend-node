const mongoose = require("mongoose");

const connectDB = () => {
  const mongoURI = "mongodb://127.0.0.1:27017/add_product";
  mongoose
    .connect(mongoURI)
    .then(() =>
      console.log("Add Product Details DataBase Connected Sucessfully...")
    )
    .catch((error) =>
      console.log(
        "Error in connecting with the Add Product Details database",
        error
      )
    );
};

module.exports = connectDB;
