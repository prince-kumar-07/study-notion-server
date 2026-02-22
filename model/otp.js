const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailOtpTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema  = new mongoose.Schema({
     
    email:{
        type:String
    },
    otp: {
        type:String,
        required:true
    },
    createdAt: {
        type:Date,
        default: Date.now,
        expires: 5*60
    }

})
    
  async function sendVerificationEmail(email, otp){

    try {
        

        const mailResponse = await mailSender(email, `Verfication email from Study Notion`, emailOtpTemplate(otp))
    }
    catch(error){
        console.log(`error occured while sending mail otp.js line 26 ` + error)
        throw error; 
    }
 
  }

 OTPSchema.pre("save", async function () {
  await sendVerificationEmail(this.email, this.otp);
});


module.exports = mongoose.model("OTP", OTPSchema);
