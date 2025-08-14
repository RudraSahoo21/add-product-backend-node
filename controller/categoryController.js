const CategoryModel = require("../model/category");
const SubCategoryModel = require("../model/subCategory");

/* Categogy 
-------------------------------------------------
*/
//adding new catageory details
const addCategoryDetails = async (req, res) => {
  try {
    const { id, name } = req.body;

    const savedcategogy = await new CategoryModel({
      index: id,
      name: name,
    }).save();
    res.status(201).json({
      success: true,
      message: "category details loaded succesfully ",
      data: savedcategogy,
    });
  } catch (error) {
    console.error("Unable to load the data in category..");
    res.status(500).json({ success: false, error: error.message });
  }
};
// fetching all the category list when page load
const fetchAllCategoryDetails = async (req, res) => {
  try {
    const categoryList = await CategoryModel.find()
      .select("-__v")
      .sort({ index: 1 });
    res.status(200).json({
      success: true,
      message: "All Categoty details fetched successfully",
      data: categoryList,
    });
  } catch (error) {
    console.error("Unable to fetch the data of category..");
    res.status(500).json({ success: false, error: error.message });
  }
};

/* Sub-Category 
-------------------------------------------------
*/
// adding subcategory details
const addSubCategoryDetails = async (req, res) => {
  try {
    const { CategoryId, index, name } = req.body;
    // console.log(req.body);
    const savedSubCate = await new SubCategoryModel({
      CategoryId: CategoryId,
      index: index,
      name: name,
    }).save();
    res.status(201).json({
      success: true,
      message: "Sub-Category details loaded succesfully ",
      data: savedSubCate,
    });
  } catch (error) {
    console.error("Unable to load the data in sub-category..");
    res.status(500).json({ success: false, error: error.message });
  }
};
// fetching sub-catagory details
const fetchAllSubCategoryDetails = async (req, res) => {
  try {
    const SubCategoryList = await SubCategoryModel.find()
      .select("-__v")
      .sort({ CategoryId: 1 });
    res.status(200).json({
      success: true,
      message: "All Sub-Categoty details fetched successfully",
      data: SubCategoryList,
    });
  } catch (error) {
    console.error("Unable to fetch the data of category..");
    res.status(500).json({ success: false, error: error.message });
  }
};

// fetching category and sub-category for admin table
const combinedCatList = async (req, res) => {
  try {
    const combinedData = await CategoryModel.aggregate([
      {
        $lookup: {
          from: "subcategorydetails",
          localField: "_id",
          foreignField: "CategoryId",
          as: "subcategories",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          index: 1,
          subcategories: {
            $map: {
              input: "$subcategories",
              as: "sub",
              in: {
                _id: "$$sub._id",
                name: "$$sub.name",
                index: "$$sub.index",
              },
            },
          },
        },
      },
    ]);
    res.status(200).json({
      message: "Product Catagory and Sub-catagory data fetched successfully",
      success: true,
      data: combinedData,
    });
  } catch (error) {
    console.error(
      "error in fetching Product Catagory and Sub-catagory data",
      error.message
    );
    res.status(500).json({
      message: "error in fetching Product Catagory and Sub-catagory data",
      success: false,
      error: error.message,
    });
  }
};

// Adding New catagory and sub catagory
const addCatSubcatData = async (req, res) => {
  try {
    const { CatagoryName, SubcatagoryName } = req.body;

    // saveing catagory in catagory modal
    const lastCategory = await CategoryModel.findOne()
      .sort({ index: -1 })
      .exec();
    const nextIndex = lastCategory ? lastCategory.index + 1 : 1;
    const newCategory = new CategoryModel({
      index: nextIndex,
      name: CatagoryName,
    });
    const savedCategory = await newCategory.save();

    // saveing Sub-catagory in catagory modal
    const CategoryId = await savedCategory._id;
    const index = 1;
    const subcatData = await SubcatagoryName.map((name, i) => ({
      CategoryId: CategoryId,
      index: index + i,
      name: name,
    }));
    const savedSubcategories = await SubCategoryModel.insertMany(subcatData);

    res.status(201).json({
      success: true,
      message: "Category and Subcategories added successfully",
      category: savedCategory,
      subcategories: savedSubcategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding category and subcategory",
      error: error.message,
    });
  }
};

// export
module.exports = {
  addCategoryDetails,
  addSubCategoryDetails,
  fetchAllCategoryDetails,
  fetchAllSubCategoryDetails,
  combinedCatList,
  addCatSubcatData,
};
