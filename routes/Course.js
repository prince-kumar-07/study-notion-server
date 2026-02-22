const express = require('express');
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    deleteCourse,
    updateCourse,
    getAllCoursesCretedByMe,
    fetchEntireCourse
} = require('../controller/Course');

const {
    showAllCategories,  
    createCategory,
    categoryPageDetails
} = require('../controller/Category');

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controller/Section")


const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controller/SubSection")


const {
  createRatingAndReview,
  getAverageRating,
  getAllRatingAndReviewForCourse,
  getAllRatingAndReview
} = require("../controller/RatingAndReview")

const {auth, isInstructor, isStudent, isAdmin} = require("../middleware/auth")

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)
router.put("/updateCourse", auth, isInstructor, updateCourse)
router.get("/created-courses", auth, isInstructor, getAllCoursesCretedByMe)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.put("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.put("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

router.get("/entireCourse", auth, fetchEntireCourse)


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.get("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRatingAndReview)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingAndReview)

module.exports = router
