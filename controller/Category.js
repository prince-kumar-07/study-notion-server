const Category = require("../model/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });

    console.log(categoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Create category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating new category",
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true },
    );
    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      allCategories,
    });
  } catch (error) {
    console.error("showAllCategories Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching all categories from Database",
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category Id is required",
      });
    }

    const categoryDetails = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "No category found with this id",
      });
    }

    const differentCategoryCourses = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    //top selling courses from different categories
    // todo

    return res.status(200).json({
      success: true,
      message: "Category details fetched successfully",
      categoryDetails,
      differentCategoryCourses,
    });
  } catch (error) {
    console.error("categoryPageDetails Error:", error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching category details from Database",
    });
  }
};
