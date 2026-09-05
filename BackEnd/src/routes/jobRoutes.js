const express = require("express");

const router = express.Router();

const {
    getJobs,
    createJob,
    getSingleJob,
    updateJob,
    deleteJob,
    getMyPostedJobs,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const validate = require("../middleware/validationMiddleware");

const { createJobValidator } = require("../validators/jobValidator");

router.get("/", getJobs);
router.get("/my-jobs", authMiddleware, authorize("recruiter"), getMyPostedJobs);
router.get("/:id", getSingleJob);

router.post("/", authMiddleware, authorize("recruiter"), createJobValidator, validate, createJob);
router.put("/:id", authMiddleware, authorize("recruiter"), updateJob);
router.delete("/:id", authMiddleware, authorize("recruiter"), deleteJob);

module.exports = router;
