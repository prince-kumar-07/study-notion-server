const moongose = require("mongoose") 

const subSectionSchema  = new moongose.Schema({

   title: {
    type:String
   },
   timeDuration: {
    type: String
   },
   description: {
    type:String
   },
   videoUrl:{
    type:String
   }

})
    

module.exports = moongose.model("SubSection", subSectionSchema)