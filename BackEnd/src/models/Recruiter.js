const mongoose = require("mongoose");

const recruiterActionSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    decision: {
      type: String,
      enum: ["Selected", "Rejected", "Pending"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RecruiterAction = mongoose.model(
  "RecruiterAction",
  recruiterActionSchema
);

module.exports = RecruiterAction;
