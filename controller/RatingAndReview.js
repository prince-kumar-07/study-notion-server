const RatingAndReview = require("../model/RatingAndReview");
const Course = require("../model/Course");


exports.createRatingAndReview = async (req, res) => {

    try {

        const { rating, review, courseId } = req.body;
        const userId = req.user.id;

        // Check if the course exists
        const course = await Course.findById({_id: courseId,
            studentEnrolled: {$elemMatch: {$eq: userId}}
        });

        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: "Course not found or user not enrolled in the course" 
            });
        }
        
        const alreadyReviewed = await RatingAndReview.findOne({ course: courseId, user: userId });

        if (alreadyReviewed) {
            return res.status(400).json({ 
                success: false,
                message: "User has already reviewed this course" 
            });
        }

        const newRatingAndReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        },{new:true});

        await Course.findByIdAndUpdate(courseId, { $push: { ratingAndReviews: newRatingAndReview._id } });

        res.status(201).json({ 
            success: true,
            message: "Rating and review created successfully",
            data: newRatingAndReview,
            newRatingAndReview
         });


    }
        catch (error) {
            console.error("Error creating rating and review:", error);
            res.status(500).json({ 
                success: false,
                message: "Internal server error" 
            });
        }
}


exports.getAverageRating = async (req, res) => {

    try {

        const { courseId } = req.body.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match: { 
                    course: new mongoose.Types.ObjectId(courseId) 
                },
            },
            {
                $group: {
                    _id: "$course",
                    averageRating: { $avg: "$rating" },
                    reviews: { $push: "$review" }
                }
            }
        ])

        if(result.length > 0) {
            res.status(200).json({ 
                success: true,
                averageRating: result[0].averageRating,
                reviews: result[0].reviews,
                message: "Rating and reviews fetched successfully"
            });
        } else {
            res.status(200).json({ 
                success: true,
                averageRating: 0,
                reviews: [],
                message: "No reviews found for this course"
            });
        }
    }
        catch (error) { 
            console.error("Error calculating rating and reviews for course:", error);
            res.status(500).json({ 
                success: false,
                message: "Internal server error" 
            });
         }

}


exports.getAllRatingAndReview = async (req, res) => {
    try {

            const allRatingAndReview = await RatingAndReview.find({})
            .sort({rating: "desc" }
            .populate({
                path:"user",
                select:"firstName lastName email image"
            })
            )
            .populate({
                path:"course",
                select:"courseName thumbnail"
            })
            .exec()

            return res.status(200).json({
                success: true,
                message: "All rating and reviews fetched successfully",
                data: allRatingAndReview
            })
    }
        catch (error) { 
            console.error("Error fetching all rating and reviews:", error);
            res.status(500).json({ 
                success: false,
                message: "Internal server error" 
            });
         }
}

exports.getAllRatingAndReviewForCourse = async (req, res) => {

    try {

    }   catch (error) {
            console.error("Error fetching rating and reviews for course:", error);
            res.status(500).json({ 
                success: false,
                message: "Internal server error" 
            });
         }
}