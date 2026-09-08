const User = require("../models/User");

// POST /api/users/upload-resume (candidate only)
const uploadResumeHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No resume file uploaded",
            });
        }

        const resumeUrl = `/uploads/resumes/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                resumeUrl,
                resumeOriginalName: req.file.originalname,
                resumeUploadedAt: new Date(),
            },
            { new: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/users/upload-identity (recruiter only) — expects both files
const uploadIdentityHandler = async (req, res, next) => {
    try {
        const aadharFile = req.files?.aadhar?.[0];
        const panFile = req.files?.pan?.[0];

        if (!aadharFile || !panFile) {
            return res.status(400).json({
                success: false,
                message: "Both Aadhar card and PAN card files are required",
            });
        }

        const aadharUrl = `/uploads/identity/${aadharFile.filename}`;
        const panUrl = `/uploads/identity/${panFile.filename}`;

        // No manual review workflow exists yet, so documents are marked
        // verified as soon as both are submitted. This is the gate that
        // unlocks job posting for a recruiter.
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                aadharUrl,
                panUrl,
                identityStatus: "verified",
                identitySubmittedAt: new Date(),
            },
            { new: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Identity documents submitted and verified successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadResumeHandler,
    uploadIdentityHandler,
};
