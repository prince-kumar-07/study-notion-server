// Import the required modules
const express = require("express")
const router = express.Router()


const { capturePayment, verifyPayment, sendPaymentSuccessEmail, sendPaymenfailedEmail, getAllInvoices } = require("../controller/Payments")
const { auth, isStudent } = require("../middleware/auth")


router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);
router.post("/sendPaymentFailEmail", auth, isStudent, sendPaymenfailedEmail);
router.get("/getAllInvoices", auth, isStudent, getAllInvoices);

module.exports = router