const { razorpayInstance } = require("../config/razerpay");
const Course = require("../model/Course");
const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
require("dotenv").config();
const Cypto = require("crypto");
const { error } = require("console");

exports.capturePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is missing",
      });
    }

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found in database",
      });
    }

    if (course.price === 0) {
      return res.status(400).json({
        success: false,
        message: "This course is free, no payment required",
      });
    }

    const uid = new moongoose.Types.ObjectId(userId);

    if (course.studentsEnrolled.includes(uid)) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in this course",
      });
    }

    const amount = course.price * 100;
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `receipt_${new Date().getTime()}`,
      notes: {
        courseId: course._id.toString(),
        userId: userId,
      }
    };

    try {
      const paymentResponse = await razorpayInstance.orders.create(options);
      res.status(200).json({
        success: true,
        message: "Payment order created successfully",
        orderId: paymentResponse.id,
        amount: paymentResponse.amount,
        currency: paymentResponse.currency,
        thumbnail: course.thumbnail,
        courseName: course.courseName

      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment order",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to capture payment",
      error: error.message,
    });
  }
};

exports.verifySignature = async (req, res) => {
    try {   
        
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];

       const SHAsum = Cypto.createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

        if (SHAsum === signature) {
            console.log("Payment signature verified successfully");

            const { courseId, userId } = req.body.payload.payment.entity.notes;

            const course = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentEnrolled: userId } },
                { new: true }
            );

            if (!course) {
                console.error("Course not found for ID:", courseId);
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            const user = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true }
            );

            if (!user) {            
                console.error("User not found for ID:", userId);
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            // const emailResponse = await mailSender.sendEmail({
            //     to: user.email,
            //     subject: "Course Enrollment Successful - StudyNotion",
            //     text: courseEnrollmentEmail(user.name, course.courseName),
            // })

            res.status(200).json({
                success: true,
                message: "Payment signature verified successfully",
            });
        } 
        else {
            console.error("Payment signature verification failed");
            console.log(error)
            res.status(400).json({
                success: false,
                message: "Payment signature verification failed",
            });
        }





    } catch (error) {
        console.error("Error verifying payment signature:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify payment signature",
            error: error.message,
        });
    }
}
