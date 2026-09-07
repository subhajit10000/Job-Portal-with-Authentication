const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        requirements: {
            type: String,
            trim: true,
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
            default: "Full-time",
        },

        salary: {
            type: String,
            trim: true,
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Job",
    jobSchema
);
