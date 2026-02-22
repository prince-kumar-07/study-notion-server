const moongose = require("mongoose") 

const courseSchema = new moongose.Schema({

    courseName: {
        type:String,
        trim:true,
        required:true
    },
    courseDescription: {
        type:String,
        trim:true,
        required:true
    },
    instructor: {
        type:moongose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn: {
        type:String,
        trim:true,
        required:true
    },
    courseContents: [
        {
            type:moongose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    price: {
        type:Number
    },
    thumbnail: {
        type: String
    },
    tag:{
        type: String,
        trim:true,
        required:true
    },
    category: {
        type: moongose.Schema.Types.ObjectId,
        ref: "Category"
    },
    studentEnrolled: [{
        type:moongose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }]
})
    

module.exports = moongose.model("Course", courseSchema)