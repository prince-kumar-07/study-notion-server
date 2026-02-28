const express = require('express');
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    deleteCourse,
    updateCourse,
    getAllCoursesCretedByMe,
    fetchEntireCourse,
    getEnrolledCourses,
    getEnrolledCourseDetails
} = require('../controller/Course');

const {
    showAllCategories,  
    createCategory,
    categoryPageDetails,
    updateCategory
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

router.post("/createCourse", auth, isInstructor, createCourse)
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)
router.put("/updateCourse", auth, isInstructor, updateCourse)
router.get("/created-courses", auth, isInstructor, getAllCoursesCretedByMe)

router.post("/addSection", auth, isInstructor, createSection)

router.put("/updateSection", auth, isInstructor, updateSection)

router.delete("/deleteSection", auth, isInstructor, deleteSection)

router.put("/updateSubSection", auth, isInstructor, updateSubSection)

router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection)

router.post("/addSubSection", auth, isInstructor, createSubSection)

router.get("/getAllCourses", getAllCourses)

router.get("/getCourseDetails/:courseId", getCourseDetails)
router.get("/getEnrolledCourses/:userId", auth, isStudent, getEnrolledCourses)
router.get("/getEnrolledCourseDetails/:courseId", auth, isStudent, getEnrolledCourseDetails)

router.get("/entireCourse", auth, fetchEntireCourse)


router.post("/createCategory", auth, isAdmin, createCategory)
router.put("/updateCategory", auth, isAdmin, updateCategory)
router.get("/showAllCategories", showAllCategories)
router.get("/getCategoryPageDetails", categoryPageDetails)

router.post("/createRating", auth, isStudent, createRatingAndReview)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingAndReview)

module.exports = router
