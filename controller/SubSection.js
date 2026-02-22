const SubSection = require("../model/SubSection");
const Section = require("../model/Section");
const cloudinary = require("../config/cloudinary");
const {uploadImageToCloudinary}  = require("../utils/imageUploder");
require("dotenv").config()

exports.createSubSection = async (req, res) => {

  const { title, sectionId, description, timeDuration } = req.body;
    const video = req.files.videoFile;

    console.log(title, sectionId, description, timeDuration, video)
  try {
    

    if (!title || !sectionId || !description || !timeDuration || !video) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }

    // Upload video to Cloudinary
    const uploadResult = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME,
    );

    const subsection = await SubSection.create({
      title: title,
      description: description,
      timeDuration: timeDuration,
      videoUrl: uploadResult.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subsection._id } },
      { new: true },
    ).populate("subSection");

    console.log("Subsection created and added to section:", updatedSection);

    res.status(200).json({
      message: "Subsection created successfully",
      data: updatedSection,
      status: true,
    });
  } catch (error) {
    console.log("error in createSubSection", error);
    res.status(500).json({
      message: "Failed to create subsection",
      error: error.message,
      status: false,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { title, description, timeDuration, subSectionId } = req.body;
    const video = req.files?.videoFile;

    const updateData = {
      title,
      description,
      timeDuration,
    };

    if (video) {
      const uploadResult = await cloudinary.uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME,
      );
      updateData.videoUrl = uploadResult.secure_url;
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updateData,
      { new: true },
    );

    res.status(200).json({
      message: "Subsection updated successfully",
      data: updatedSubSection,
      status: true,
    });
  } catch (error) {
    console.log("error in updateSubSection", error);
    res.status(500).json({
      message: "Failed to update subsection",
      error: error.message,
      status: false,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  const { subSectionId, sectionId } = req.body;

  console.log("delete Sub Section", subSectionId, sectionId)

  try {

    if (!subSectionId || !sectionId) {
  return res.status(400).json({
    success: false,
    message: "subSectionId and sectionId are required",
  });
}

    
    await SubSection.findByIdAndDelete(subSectionId);

    // Update section to remove the deleted subsection
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true },
    );

    res.status(200).json({
      message: "Subsection deleted successfully",
      data: updatedSection,
      status: true,
    });
  } catch (error) {
    console.log("error in deleteSubSection", error);
    res.status(500).json({
      message: "Failed to delete subsection",
      error: error.message,
      status: false,
    });
  }
};
