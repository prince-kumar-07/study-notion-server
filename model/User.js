const moongose = require("mongoose")

const userSchema = new moongose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  confirmPassowrd: {
    type: String,
    require: true,
  },
  contactNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    required: true,
  },
  additionalDetails: {
    type: moongose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  isEmailVerified: {
    type: Boolean,
    required: true,
  },
  courses: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  image: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  courseProgress: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],

  deleteScheduledAt: {
    type: Date,
    default: null,
  },

  deleteRequested: {
    type: Boolean,
    default: false,
  },

   blockInfo: {
    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    blockedBy: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    blockedAt: {
      type: Date,
      default: null,
    },

    reason: {
      type: String,
      trim: true,
      default: null,
    },
  },

   instructorApproval: {
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: function () {
        return this.accountType === "Instructor" ? "Pending" : null;
      },
    },

    approvedBy: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },


});

module.exports = moongose.model("User", userSchema)