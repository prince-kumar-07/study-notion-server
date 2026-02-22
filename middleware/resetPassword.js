const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const bcrypt = requir("bcrypt");

//resetPasswordToken

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        message: "Your email is not registered with our database",
        success: false,
      });
    }

    const token = crypto.randomUUID();

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true },
    );

    const url = `http://localhost:3000/update/password/${token}`;

    await mailSender(
      email,
      "Password reset Link",
      `Password reset Link: ${url}`,
    );

    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully. Please check your email to change your password.",
    });
  } catch (error) {
    console.error("Reset Password Token Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password email",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    const userDetails = await User.findOne({ token });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating new password",
    });
  }
};
