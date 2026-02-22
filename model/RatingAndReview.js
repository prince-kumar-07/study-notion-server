const moongose = require("mongoose") 

const ratingAndReviewSchema  = new moongose.Schema({


    user: {
        type:moongose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    rating: {
        type:Number,
        required:true
    },
    review: {
        type:String,
        required:true,
        trim:true
    }

  

})
    

module.exports = moongose.model("RatingAndReview", ratingAndReviewSchema)