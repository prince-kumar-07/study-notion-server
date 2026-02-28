const express = require("express")
const router = express.Router()
const { auth, isAdmin } = require("../middleware/auth")
const {
  // deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  getUserDetails,
  scheduleDeleteAccount,
  getAllInstructor,
  updateUserBlockStatus,
  updateUserAccountType,
  getAllPendingApprovalAndRejectedInstructor,
  updateInstructorApproval
  
  // cancelDeleteAccount 
} = require("../controller/Profile")


router.delete("/deleteProfile", auth, scheduleDeleteAccount)
router.put("/updateProfile", auth, updateProfile)
// route
router.get("/getAllUserDetails", auth, isAdmin, getAllUserDetails);
router.get("/getUserDetails", auth, getUserDetails);
router.get("/getAllInstructor", auth, getAllInstructor);
router.get("/getAllPendingApprovalAndRejectedInstructor", auth, getAllPendingApprovalAndRejectedInstructor),
router.post("/updateInstructorApproval", auth, updateInstructorApproval);
router.post("/updateUserBlockStatus", auth, updateUserBlockStatus);
router.post("/updateUserAccountType", auth, updateUserAccountType);

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router