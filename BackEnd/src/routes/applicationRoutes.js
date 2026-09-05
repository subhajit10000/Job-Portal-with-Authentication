const express = require("express");

const router = express.Router();
const {
    getMyApplications,
    applyJob,
    getApplicantsForJob,
    updateApplicationStatus,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Candidate routes
router.get("/my-applications", authMiddleware, authorize("candidate"), getMyApplications);
router.post("/:jobId", authMiddleware, authorize("candidate"), applyJob);

// Recruiter routes
router.get("/job/:jobId", authMiddleware, authorize("recruiter"), getApplicantsForJob);
router.patch("/:id/status", authMiddleware, authorize("recruiter"), updateApplicationStatus);

module.exports = router;
