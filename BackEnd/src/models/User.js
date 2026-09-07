const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },

        role: {
            type: String,
            enum: ["candidate", "recruiter"],
            default: "candidate",
        },

        // --- Email verification (OTP, one-time at registration only) ---
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        otpCodeHash: {
            type: String,
            default: null,
            select: false,
        },
        otpExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },
        otpLastSentAt: {
            type: Date,
            default: null,
            select: false,
        },
        otpAttempts: {
            type: Number,
            default: 0,
            select: false,
        },

        // --- Refresh token sessions (hashed, one entry per active device) ---
        refreshTokens: {
            type: [
                {
                    tokenHash: { type: String, required: true },
                    expiresAt: { type: Date, required: true },
                    createdAt: { type: Date, default: Date.now },
                },
            ],
            default: [],
            select: false,
        },

        // --- Candidate: CV / resume ---
        resumeUrl: {
            type: String,
            default: null,
        },
        resumeOriginalName: {
            type: String,
            default: null,
        },
        resumeUploadedAt: {
            type: Date,
            default: null,
        },

        // --- Recruiter: identity verification (required before posting a job) ---
        aadharUrl: {
            type: String,
            default: null,
        },
        panUrl: {
            type: String,
            default: null,
        },
        identityStatus: {
            type: String,
            enum: ["not_submitted", "pending", "verified"],
            default: "not_submitted",
        },
        identitySubmittedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
