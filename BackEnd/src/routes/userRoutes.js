const express = require("express");

const router = express.Router();

const { uploadResumeHandler, uploadIdentityHandler } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { uploadResume, uploadIdentity } = require("../middleware/uploadMiddleware");

// Candidate: upload/replace CV
router.post(
    "/upload-resume",
    authMiddleware,
    authorize("candidate"),
    uploadResume,
    uploadResumeHandler
);

// Recruiter: upload Aadhar + PAN before being allowed to post jobs
router.post(
    "/upload-identity",
    authMiddleware,
    authorize("recruiter"),
    uploadIdentity,
    uploadIdentityHandler
);

module.exports = router;
