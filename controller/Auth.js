const User = require("../model/User");
const OTP = require("../model/otp");
const otpGenerater = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../model/Profile");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const passwordUpdatedTemplate = require("../mail/templates/passwordUpdate");
const signupEmailTemplate = require("../mail/templates/signupEmailTemplate");
const loginAlertEmailTemplate = require("../mail/templates/loginEmailTemplate");
const mailSender = require("../utils/mailSender");
const UAParser = require("ua-parser-js");
const DeviceDetector = require("device-detector-js");
const axios = require("axios");
const removeAccountDeletionTemplate = require("../mail/templates/removeAccountDeletion")
// const requestIp = require("request-ip");


// sendOTP
exports.sendOTP = async (req, res, next) => {
  // console.log("sendOTP HIT", typeof next);
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

// signUP

exports.signUP = async (req, res) => {
 
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

    await mailSender(
          user.email,
          "Welcome to Study Notion — Your Account Has Been Created",
          signupEmailTemplate(user.firstName+" "+user.lastName, user.email, user.accountType),
        );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      // user,
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
  console.time("LOGIN_API");
  try {
    const { email, password, revokeDeletion, latitude, longitude } = req.body;

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

      // await mailSender(
      //   user.email,
      //   "Account Deletion Cancelled",
      //   removeAccountDeletionTemplate(
      //     user.firstName + " " + user.lastName,
      //     user.email,
      //   ),
      // );
    }

    // let locationData = {};

    // if (latitude && longitude) {
    //   const address = await getAddressFromCoordinates(latitude, longitude);

    //   locationData = {
    //     latitude,
    //     longitude,
    //     fullAddress: address?.fullAddress || null,
    //     city: address?.city || null,
    //     state: address?.state || null,
    //     country: address?.country || null,
    //     pincode: address?.pincode || null,
    //   };
    // }

    // console.log("Location:", locationData);

    // const deviceInfo = getDeviceDetails(req);
    // deviceInfo.ipAddress = getClientIP(req);

    // await Profile.findByIdAndUpdate(user.additionalDetails._id, {
    //   $push: {
    //     loginHistory: {
    //       $each: [
    //         {
    //           ...deviceInfo,
    //           location: locationData,
    //         },
    //       ],
    //       $slice: -2, 
    //     },
    //   },
    // });

    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

 
    user.password = undefined;

    // await mailSender(
    //   user.email,
    //   "New Login Detected",
    //   loginAlertEmailTemplate(
    //     `${user.firstName} ${user.lastName}`,
    //     user.email,
    //     deviceInfo
    //   )
    // );

    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true, 
      sameSite: "None", 
    };

    console.timeEnd("LOGIN_API");

    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "Login successful",
      });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// change Password

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

    await mailSender(
          user.email,
          "Password Changed Successfully",
          passwordUpdatedTemplate(user.email, user.firstName +" "+user.lastName),
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


function getClientIP(req) {

  let ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    null;

  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0];
  }

  // Convert IPv6 localhost to IPv4 localhost
  if (ip === "::1") {
    ip = "127.0.0.1";
  }

  // Remove IPv6 prefix
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return ip;
}



function getDeviceDetails(req) {

  const userAgent = req.headers["user-agent"];

  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const detector = new DeviceDetector();

  const deviceData = detector.parse(userAgent);

  // Detect browser name correctly
  let browserName = browser.name || "Unknown Browser";

  // Detect Brave manually
  if (userAgent.includes("Brave")) {
    browserName = "Brave";
  }

  // Detect Edge
  if (userAgent.includes("Edg")) {
    browserName = "Microsoft Edge";
  }

  // Detect Chrome properly
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browserName = "Chrome";
  }

  // Detect device type
  let deviceType = "Desktop Computer";

  if (deviceData.device && deviceData.device.type) {
    deviceType = deviceData.device.type;
  }

  // Detect brand if available
  let deviceBrand = deviceData.device?.brand || os.name;

  return {

    browserName: browserName,
    browserVersion: browser.version,

    osName: os.name,
    osVersion: os.version,

    deviceType: deviceType,

    deviceBrand: deviceBrand,

    fullDeviceName: `${deviceBrand} ${deviceType}`,

  };

}


async function getAddressFromCoordinates(latitude, longitude) {

  try {

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "studynotion-app"
      }
    });

    const data = response.data;

    return {
      fullAddress: data.display_name,
      city: data.address.city || data.address.town || data.address.village,
      state: data.address.state,
      country: data.address.country,
      pincode: data.address.postcode,
    };

  }
  catch (error) {

    console.log("Reverse geolocation error:", error.message);
    return null;

  }

}
