const moongose = require("mongoose") 

const sectionSchema  = new moongose.Schema({

   sectionName: {
    type:String
   },
   subSection: 
   [
    {
        type:moongose.Schema.Types.ObjectId,
        required:true,
        ref:"SubSection"
    }
   ]

})
    

module.exports = moongose.model("Section", sectionSchema)