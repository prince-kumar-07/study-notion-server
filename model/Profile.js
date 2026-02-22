const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
    },

    browserName: {
      type: String,
    },

    browserVersion: {
      type: String,
    },

    osName: {
      type: String,
    },

    osVersion: {
      type: String,
    },

    deviceType: {
      type: String,
    },

    deviceModel: {
      type: String,
    },

    deviceVendor: {
      type: String,
    },

    userAgent: {
      type: String,
    },

  
    location: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },

      fullAddress: {
        type: String,
      },

      city: {
        type: String,
      },

      state: {
        type: String,
      },

      country: {
        type: String,
      },

      pincode: {
        type: String,
      },
    },

    loginAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
    },

    dateOfBirth: {
      type: String,
    },

    about: {
      type: String,
      trim: true,
    },

    contactNumber: {
      type: String, // better than Number
      trim: true,
    },

    loginHistory: {
      type: [loginHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
