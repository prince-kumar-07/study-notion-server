const {instance} = require("../config/razerpay");
const Course = require("../model/Course");
const User = require("../model/User");
const Invoice = require("../model/Invoice")
const sendEmail = require("../utils/mailSender");
const  paymentSuccess  = require("../mail/templates/paymentSuccess")
const { default: mongoose } = require("mongoose");
const  paymentFailed  = require("../mail/templates/paymentFailed");
const crypto = require("crypto");
require("dotenv").config();

exports.capturePayment = async(req, res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    // console.log(courses)

    if (courses.length === 0) {
      return res.json({ success: false, message: "Please provide Course Id" });
    }

    if (!userId) {
      return res.json({ success: false, message: "Please provide user Id " });
    }

    const user = await User.findById(userId)

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;
        try{
           
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({success:false, message:"Could not find the course"});
            }

            if (user.courses.includes(course_id)) {
              return res.status(200).json({
                success: false,
                message: "Student already enrolled in one or more courses",
              });
            }

            totalAmount += course.price;
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}


//verify the payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
           
            await enrollStudents(courses, userId, razorpay_order_id, razorpay_payment_id, res);
            
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:false, message:"Payment Failed"});

}


  const enrollStudents = async (
  courses,
  userId,
  razorpay_order_id,
  razorpay_payment_id,
  res
) => {

  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide data for Courses or UserId",
    });
  }

  try {

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    for (const courseId of courses) {

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      await Course.findByIdAndUpdate(
        courseId,
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      );

      await Invoice.create({

        user: userId,

        course: course._id,

        courseName: course.courseName,

        price: course.price,

        discount: 0,

        finalAmount: course.price,

        email: user.email,

        phone: user.contactNumber,

        razorpay_order_id,

        razorpay_payment_id,

        invoiceNumber: `INV-${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}`,

        purchasedAt: new Date(),
      });

    }

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.sendPaymenfailedEmail = async (req, res) => {
  const { descrption, paymentId, orderId, amount } = req.body;

  const userId = req.user.id;

  if (!descrption || !paymentId || !amount || !userId || !orderId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await sendEmail(
      enrolledStudent.email,
      enrolledStudent.firstName + " " + enrolledStudent.lastName,
      "Payment Successfull || Study Notion",
      paymentFailed(
        descrption,
        paymentId,
        orderId,
        amount/100,
        enrolledStudent.firstName + " " + enrolledStudent.lastName,
        enrolledStudent.email,
      ),
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send email" });
  }
};


exports.sendPaymentSuccessEmail = async (req, res) => {
    
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  // console.log(orderId, paymentId, amount, userId)

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await sendEmail(
      enrolledStudent.email,
      enrolledStudent.firstName + " " + enrolledStudent.lastName,
      "Payment Successfull || Study Notion",
      paymentSuccess(
        orderId,
        paymentId,
        amount/100,
        enrolledStudent.firstName + " " + enrolledStudent.lastName,
        enrolledStudent.email,
      ),
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send email" });
  }
};



exports.getAllInvoices = async (req, res) => {
  try {

    const userId = req.user.id;

    const invoices = await Invoice.find({ user: userId }).sort({ createdAt: -1 });

    const data = await Promise.all(
      invoices.map(async (invoice) => {

        const user = await User.findById(invoice.user)
          .select("firstName lastName");

        const course = await Course.findById(invoice.course)
          .select("courseName");

        return {
          ...invoice._doc,
          studentName: user ? `${user.firstName} ${user.lastName}` : null,
          courseName: course ? course.courseName : invoice.courseName,
        };

      })
    );

    return res.status(200).json({
      success: true,
      invoices: data
    });

  } catch (error) {

    console.error("Error fetching invoices:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices"
    });

  }
};