const Course = require("../model/Course");
const Category = require("../model/Category");
const User = require("../model/User");
const { uploadImageToCloudinary } = require("../utils/imageUploder");
require("dotenv").config();


exports.createCourse = async (req, res) => {

  console.log(req.body)
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
    } = req.body;

    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category ||
      !thumbnail
    ) {
      console.error("All data is required to create a course");

      return res.status(400).json({
        success: false,
        message: "Missing data. All fields are required.",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDeatils = await User.findById(userId);

    console.log("instructorDeatils " + instructorDeatils);

    if (!instructorDeatils) {
      console.error("instructor not found");

      return res.status(404).json({
        success: false,
        message: "instructor deatils not found",
      });
    }

    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      console.error("category not found");

      console.error("category not found");

      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME,
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDeatils._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      tag,
    });

    await User.findByIdAndUpdate(
      { _id: instructorDeatils._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true },
    );

    //update category schema todo
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true },
    );

    return res.status(201).json({
      success: true,
      message: "course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("error while creating course:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getAllCourses = async (req, res) => {
  // console.log(req.user.id)
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        ratingAndReview: true,
        studentEnrolled: true,
        courseDescription: true,
        whatYouWillLearn: true,
        tag: true,
        category: true,
      },
    )
      .populate({
        path: "instructor",
        select: "_id firstName lastName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched suucessfully",
      data: allCourses,
    });
  } catch (error) {
    console.error("error while fetching courses :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { _id } = req.body;
    const courseId = _id;

    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      }).exec();

    if (!courseDetails || courseDetails.length === 0) {
      console.error("course not found");
      return res.status(404).json({
        success: false,
        message: `course not found for id ${courseId}`,
      });
    }
  } catch (error) {
    console.error("error while fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  console.log(req)
  try {

   const { courseId } = req.body;
    // 1. Validate input
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // 2. Check if course exists
    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 3. Delete course
    await Course.findByIdAndDelete(courseId);

    // 4. Remove course reference from instructor
    await User.findByIdAndUpdate(
      courseDetails.instructor,
      {
        $pull: { courses: courseId },
      },
      { new: true }
    );

    // 5. Remove course reference from category
    await Category.findByIdAndUpdate(
      courseDetails.category,
      {
        $pull: { courses: courseId },
      }
    );

    // 6. Success response
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      deletedCourseId: courseId,
    });

  } catch (error) {

    console.error("Error while deleting course:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });

  }
};

exports.updateCourse = async (req, res) => {

  try {

    let {
      courseId,
      courseName,
      courseDescription,
      price,
      tag,
      category
    } = req.body;

    // ✅ Force convert to string
    courseId = String(courseId);
    category = String(category);

    console.log("courseId:", courseId);
    console.log("category:", category);

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        courseName,
        courseDescription,
        price: Number(price),
        tag,
        category
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse
    });

  }
  catch (error) {

    console.error("Update error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



exports.getAllCoursesCretedByMe = async (req, res) => {

  try {

    const instructorId = req.user.id;

    const allCourses = await Course.find(
      { instructor: instructorId },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        ratingAndReview: true,
        studentEnrolled: true,
        courseDescription: true,
        whatYouWillLearn: true,
        tag: true,
        category: true,
        courseContents: true   // important
      }
    )
    .populate({
      path: "instructor",
      select: "_id firstName lastName",
    })
    .populate({
      path: "category",
      select: "_id name",
    })

    // ✅ populate sections and subsections
    .populate({
      path: "courseContents",
      populate: {
        path: "subSection",
      }
    })

    .exec();

    return res.status(200).json({
      success: true,
      message: "Instructor courses fetched successfully",
      data: allCourses,
    });

  }
  catch (error) {

    console.error("Error while fetching instructor courses:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });

  }

};


exports.fetchEntireCourse = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        ratingAndReview: true,
        studentEnrolled: true,
        courseDescription: true,
        whatYouWillLearn: true,
        tag: true,
        category: true,
        courseContents: true,
        instructor: true,
      }
    )
      .populate({
        path: "instructor",
        select: "_id firstName lastName",
      })

      // populate category name
      .populate({
        path: "category",
        select: "name",
      })

      // populate section and subsection
      .populate({
        path: "courseContents",
        select: "sectionName subSection",
        populate: {
          path: "subSection",
          select: "title description timeDuration",
        },
      })

      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });

  } catch (error) {

    console.error("error while fetching courses :", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });

  }
};
