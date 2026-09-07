const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    // Snapshot of the candidate's resume at the time they applied
    resumeUrl: {
      type: String,
      required: true,
    },
    resumeOriginalName: {
      type: String,
    },

    status: {
      type: String,
      enum: ["applied", "reviewed", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a candidate from applying to the same job twice
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
