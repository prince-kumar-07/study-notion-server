const jwt = require("jsonwebtoken");
require("dotenv").config();

// AUTH MIDDLEWARE
exports.auth = async (req, res, next) => {
  // console.log("Authorization Header:", req.header("Authorization"));

  try {
    const token =
      req.cookies?.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // console.log("Middleware ", req.user)
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid, Logout & login Again",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// STUDENT CHECK
exports.isStudent = async (req, res, next) => {
  try {
    if (!req.user || req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This route is only for students",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Student role verification failed",
    });
  }
};

// INSTRUCTOR CHECK
exports.isInstructor = async (req, res, next) => {
  try {
    if (!req.user || req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This route is only for instructors",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Instructor role verification failed",
    });
  }
};

// ADMIN CHECK
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This route is only for admins",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin role verification failed",
    });
  }
};
