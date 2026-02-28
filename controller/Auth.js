const User = require("../model/User");
const OTP = require("../model/otp");
const otpGenerater = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../model/Profile");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const passwordUpdatedTemplate = require("../mail/templates/passwordUpdate");
const signupEmailTemplate = require("../mail/templates/signupEmailTemplate");

const removeAccountDeletionTemplate = require("../mail/templates/removeAccountDeletion")
const sendEmail = require("../utils/mailSender")
const {getDeviceDetails, getClientIP, getAddressFromCoordinates} = require("../utils/deviceInfo")
const loginEmailTemplate = require("../mail/templates/loginEmailTemplate")



exports.sendOTP = async (req, res, next) => {

  try {
    
    const { email } = req.body;

    const checkUserPersent = await User.findOne({ email });

    if (checkUserPersent) {
      return res.status(401).json({
        success: false,
        message: `User already registered`,
      });
    }


    var otp = otpGenerater.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // console.log("OTP :" + otp);

    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerater.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }


    // const otpTemplete = emailOtpTemplate(otp)
    const otpPayload = { email, otp};

    const otpBody = await OTP.create(otpPayload);
    // console.log("OTP BODY " + otpBody);

    res.status(200).json({
      success: true,
      message: `OTP sent Successfully`,
      // otp,
    });
    next();
  } catch (error) {
    console.log(`Error while sending OTP ` + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.signUP = async (req, res) => {
  console.time("SIGNUP_TIME");
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !contactNumber ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password mismatch",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOTP.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    } else if (otp !== recentOTP[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDeatis = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

  const user = await User.create({
  firstName,
  lastName,
  email,
  password: hashedPassword,
  accountType,
  contactNumber,
  isEmailVerified: true,
  additionalDetails: profileDeatis._id,
  image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
});


    user.password = undefined;


    await sendEmail(
          user.email,
          user.firstName + " " + user.lastName,
          "Welcome to Study Notion — Your Account Has Been Created",
          signupEmailTemplate(user.firstName+" "+user.lastName, user.email, user.accountType),
        );

        console.timeEnd("SIGNUP_TIME");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
   
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


exports.login = async (req, res) => {
 console.time("LOGIN_TIME");
  try {
    
   
    const { email, password, revokeDeletion } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

   if (user.blockInfo?.isBlocked) {
     return res.status(403).json({
       success: false,
       errorCode: "ACCOUNT_BLOCKED",
       message:
         "Your account is blocked. Contact administrator for assistance.",
     });
   }

   if (user.accountType === "Instructor") {
     if (user.instructorApproval?.status === "Rejected") {
       return res.status(403).json({
         success: false,
         errorCode: "ACCOUNT_REJECTED",
         message: "Your instructor account has been rejected.",
       });
     }

     if (user.instructorApproval?.status !== "Approved") {
       return res.status(403).json({
         success: false,
         errorCode: "ACCOUNT_PENDING_APPROVAL",
         message: "Your instructor account is pending admin approval.",
       });
     }
   }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (user.deleteRequested && !revokeDeletion) {
       const data = {}
       data.deleteRequested = user.deleteRequested
       data.deleteScheduledAt = user.deleteScheduledAt
      return res.status(200).json({
        success: true,
        data: data,
        message: "Account scheduled for deletion",
      });
    }
 
    if (user.deleteRequested && revokeDeletion) {
      user.deleteRequested = false;
      user.deleteScheduledAt = null;
      await user.save();

      await sendEmail(
        email,
        user.firstName + " " + user.lastName,
        "Account Deletion Cancelled",
        removeAccountDeletionTemplate(
          user.firstName + " " + user.lastName,
          user.email,
        ),
      );
    }

    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

     const cookieOptions = {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true, 
      sameSite: "None", 
    };

    user.password = undefined;

     console.timeEnd("LOGIN_TIME");
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "Login successful",
      })

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
  
};


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();


        await sendEmail(
          user.email,
          user.firstName + " " + user.lastName,
          "Password Changed Successfully",
          passwordUpdatedTemplate(
            user.email,
            user.firstName + " " + user.lastName,
          ),
        );
    
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });


  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
    });
  } 
}


exports.postLoginHandler = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    // console.log(latitude, longitude )

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = req.user.id;
    //  console.log("id", id )

    const deviceInfo = getDeviceDetails(req);
    deviceInfo.ipAddress = getClientIP(req);

    let locationData = null;

   if (latitude && longitude) {
  const address = await getAddressFromCoordinates(latitude, longitude);
  //  console.log("addrees ", address )

  locationData = {
    latitude,
    longitude,
    fullAddress: address?.fullAddress || null,
    city: address?.city || null,
    state: address?.state || null,
    country: address?.country || null,
    pincode: address?.pincode || null,
  };
}
    const user = await User.findById(id);

    if (!user?.additionalDetails?._id) {
      return res.status(200).json({
        success: true,
        message: "No profile details found",
      });
    }

    const loginEntry = {
      ...deviceInfo,
    };

    if (locationData) {
      loginEntry.location = locationData;
    }

    await Profile.findByIdAndUpdate(user.additionalDetails._id, {
      $push: {
        loginHistory: {
          $each: [loginEntry],
          $slice: -2,
        },
      },
    });

    // await sendEmail(
    //   user.email,
    //   user.firstName + " " + user.lastName,
    //   "New Login Detected, - Study Notion",
    //   loginEmailTemplate(
    //     user.firstName + " " + user.lastName,
    //     user.email,
    //     deviceInfo,
    //   ),
    // );

    return res.status(200).json({
      success: true,
      message: "Login details stored successfully",
    });
  } catch (error) {
    console.error("PostLoginHandler Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to store login details",
    });
  }
};










