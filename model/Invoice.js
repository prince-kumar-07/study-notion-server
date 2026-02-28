const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
{
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  course:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  courseName:{
    type:String,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  discount:{
    type:Number,
    default:0
  },

  finalAmount:{
    type:Number,
    required:true
  },

  email:{
    type:String,
    required:true
  },

  phone:{
    type:String,
    required:true
  },

  razorpay_order_id:{
    type:String,
    required:true,
    index:true
  },

  razorpay_payment_id:{
    type:String,
    required:true,
    index:true
  },

  invoiceNumber:{
    type:String,
    unique:true
  },

  paymentStatus:{
    type:String,
    enum:["success","pending","failed"],
    default:"success"
  },

  paymentMethod:{
    type:String,
    default:"razorpay"
  },

  purchasedAt:{
    type:Date,
    default:Date.now
  }

},
{ timestamps:true }
);

module.exports = mongoose.model("Invoice",invoiceSchema);