const express = require("express")
const router = express.Router()

const {
  login,
  signUP,
  sendOTP,
  changePassword,
  postLoginHandler
} = require("../controller/Auth")

const {
  resetPasswordToken,
  resetPassword,
} = require("../controller/ResetPassword")

const { auth } = require("../middleware/auth")

router.post("/login", login)

router.post("/postLoginHandler", auth, postLoginHandler)

router.post("/signup", signUP)

router.post("/sendotp", sendOTP)

router.post("/changepassword", auth, changePassword)

router.post("/reset-password-token", resetPasswordToken)

router.post("/reset-password", resetPassword)

module.exports = router