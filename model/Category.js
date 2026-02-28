const moongose = require("mongoose") 

const categorySchema  = new moongose.Schema({
     
    name:{
        type:String,
        required: true,
        trim:true
    },
    description: {
        type:String
    },
    courses: [
  {
    type: moongose.Schema.Types.ObjectId,
    ref: "Course"
  }
]

})
    

module.exports = moongose.model("Category", categorySchema)