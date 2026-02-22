const Profile = require("../model/Profile");
const User = require("../model/User");
const { uploadImageToCloudinary } = require("../utils/imageUploder");
const accountDeleteRequestTemplate = require("../mail/templates/accountDeleteRequest");
const cancelDeleteAccountTemplate = require("../mail/templates/cancelDeleteAccount");
const mailSender = require("../utils/mailSender");


exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await User.findById(userId).populate("additionalDetails");
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(`Error while fetching profile ` + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth, about, contactNumber } = req.body;
    const id = req.user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!gender && !dateOfBirth && !about && !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const profileId = userDetails.additionalDetails;

    const profileDetails = await Profile.findById(profileId);
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (gender) profileDetails.gender = gender;
    if (dateOfBirth) profileDetails.dateOfBirth = dateOfBirth;
    if (about) profileDetails.about = about;
    if (contactNumber) profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    const afterSaveResult = await User.findById(id).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data:afterSaveResult
    });
  } catch (error) {
    console.error("Error while updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// exports.deleteAccount = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log("Deleting:", email);

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }


//     if (user.additionalDetails) {
//       await Profile.findByIdAndDelete(user.additionalDetails);
//     }

//     await User.findOneAndDelete({ email });

//     return res.status(200).json({
//       success: true,
//       message: "Profile deleted successfully",
//     });

//   } catch (error) {
//     console.error("Error while deleting profile:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userDetails = await User.findById(userId)
      .populate("additionalDetails");

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error while fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.getAllUserDetails = async (req, res) => {

  try {

    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // exclude current user
    const allUsers = await User.find({
      _id: { $ne: currentUserId }
    }).select("-password -__v");

    return res.status(200).json({
      success: true,
      message: "All user details fetched successfully",
      count: allUsers.length,
      data: allUsers,
    });

  } catch (error) {

    console.error("Error while fetching all user details:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {

    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
    console.log("image ,", image, updatedProfile, image.secure_url)

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.scheduleDeleteAccount = async (req, res) => {

    
    // console.log(userId)


  try {
    const userId = req.user.id;

    const deleteAfterDays = 15;

    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() + deleteAfterDays);

     const user = await User.findByIdAndUpdate(userId, {
      deleteRequested: true,
      deleteScheduledAt: deleteDate,
    });

    await mailSender(
      user.email,
      "Account Deletion Request Received - Study Notion",
      accountDeleteRequestTemplate(user.firstName+" "+user.lastName, user.email, deleteDate),
    );

    res.json({
      success: true,
      message: "Account scheduled for deletion",
      deleteDate,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error scheduling delete",
    });
  }
};


exports.getAllStudent = async (req, res) => {

  try {

    const instructors = await User.find({ accountType: "Student" }).select(
      "-password -__v",
    );

    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAllInstructor = async (req, res) => {

  try {

    const instructors = await User.find({ accountType: "Instructor" }).select(
      "-password -__v",
    );

    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const currentAdminId = req.user.id;

    const admins = await User.find({
      accountType: "Admin",
      _id: { $ne: currentAdminId },
    }).select("-password -__v");

    return res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



exports.updateUserBlockStatus = async (req, res) => {
  try {

    const {
      isBlocked,
      targetUserId,
      reason
    } = req.body;

    const adminUserId = req.user.id;

    console.log(isBlocked, targetUserId, reason, adminUserId);

    if (
      !targetUserId ||
      typeof isBlocked !== "boolean" ||
      (isBlocked && !reason)
    ) {
      return res.status(400).json({
        success: false,
        message: isBlocked
          ? "Target user ID, block status, and reason are required to block a user"
          : "Target user ID and block status are required",
      });
    }

    const blockInfo = isBlocked
      ? {
          isBlocked: true,
          blockedBy: adminUserId,
          blockedAt: new Date(),
          reason: reason || null,
        }
      : {
          isBlocked: false,
          blockedBy: null,
          blockedAt: null,
          reason: null,
        };

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { blockInfo },
      { new: true }
    )
      .select("-password -__v")
      .populate("blockInfo.blockedBy", "firstName lastName email");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      data: updatedUser,
    });

  } catch (error) {

    console.error("Update user block status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};


exports.updateUserAccountType = async (req, res) => {

  try {

    const adminUserId = req.user.id;

    const {
      targetUserId,
      newAccountType,
    } = req.body;

    console.log(adminUserId, targetUserId, newAccountType);

    if (!targetUserId || !newAccountType) {
      return res.status(400).json({
        success: false,
        message: "Target user ID and new account type are required",
      });
    }

    if (!["Admin", "Instructor"].includes(newAccountType)) {
      return res.status(400).json({
        success: false,
        message: "Account type must be Admin or Instructor",
      });
    }

    const requestingUser = await User.findById(adminUserId);

    if (!requestingUser || requestingUser.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admin can update account type",
      });
    }

    if (adminUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own account type",
      });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    targetUser.accountType = newAccountType;

    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `User account type updated to ${newAccountType}`,
      data: targetUser,
    });


  } catch (error) {

    console.error("Update account type error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }

};


exports.getAllPendingApprovalAndRejectedInstructor = async (req, res) => {
 
  try {

    const instructors = await User.find({
      accountType: "Instructor",
      "instructorApproval.status": { $in: ["Pending", "Rejected"] }
    })
    .select("-password -confirmPassowrd -__v")
    .populate("additionalDetails", "-__v")
    .populate("instructorApproval.approvedBy", "firstName lastName email")
    .sort({ createdAt: -1 });

    //  console.log(instructors)
    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
      
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



exports.updateInstructorApproval = async (req, res) => {
  try {

    const adminId = req.user.id;
    const { instructorId, status } = req.body;

    if (!instructorId || !status) {
      return res.status(400).json({
        success: false,
        message: "Instructor ID and status are required",
      });
    }

    const allowedStatus = ["Pending", "Approved", "Rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const instructor = await User.findById(instructorId);

    if (!instructor || instructor.accountType !== "Instructor") {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // update approval status
    instructor.instructorApproval.status = status;

    instructor.instructorApproval.approvedBy = adminId;

    instructor.instructorApproval.approvedAt = new Date();

    await instructor.save();

    return res.status(200).json({
      success: true,
      message: `Instructor status updated to ${status}`,
      data: instructor,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};