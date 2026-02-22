const moongose = require("mongoose") 

const courseProgress = new moongose.Schema({

    courseID: {
        type:moongose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completedVideos: {
        type:moongose.Schema.Types.ObjectId,
        ref:"Subsection"
    } 
})
    

module.exports = moongose.model("courseProgress", courseProgress)