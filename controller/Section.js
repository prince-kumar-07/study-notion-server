const Section = require("../model/Section");
const Course = require("../model/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      console.error("Missing data: sectionName or courseId");

      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContents: newSection._id,
        },
      },
      { new: true },
    );

    //retun todo HW use populate to return section & subsection both in updated course details
    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContents",
      populate: {
        path: "subSection",
      },
    });

    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("error while creating section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName } = req.body;
    // console.log("sectionId ", sectionId)
    // console.log("sectionName ", sectionName)

    if (!sectionId || !sectionName) {
      console.error("Missing data: sectionId or sectionName");

      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error("error while updating section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.body || req.params;

     console.log("sectionId ", sectionId)


    if (!sectionId) {
      console.error("Missing data: sectionId");
      return res.status(400).json({
        success: false,
        message: "Missing required property: sectionId",
      });
    }

    await Section.findByIdAndDelete(sectionId);

    //delete sectionId from course ToDo
      await Course.findOneAndUpdate(  
        { courseContents: sectionId },
        { $pull: { courseContents: sectionId } },
        { new: true }
      );


    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("error while deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
