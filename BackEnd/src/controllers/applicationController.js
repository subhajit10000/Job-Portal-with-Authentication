const Application = require("../models/Application.js");
const Job = require("../models/Job.js");
const RecruiterAction = require("../models/Recruiter.js");
const User = require("../models/User.js");

const statusToDecision = {
    hired: "Selected",
    rejected: "Rejected",
};

const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ candidate: req.user._id })
            .populate("job", "title company location description")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

const applyJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Candidate must have a CV on file before they can apply. Re-fetch
        // (rather than trusting req.user) so this can't go stale mid-session.
        const candidate = await User.findById(req.user._id);
        if (!candidate.resumeUrl) {
            return res.status(400).json({
                success: false,
                message: "Please upload your CV/resume to your profile before applying.",
            });
        }

        const application = await Application.create({
            candidate: req.user._id,
            job: jobId,
            coverLetter,
            resumeUrl: candidate.resumeUrl,
            resumeOriginalName: candidate.resumeOriginalName,
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already applied to this job",
            });
        }
        next(error);
    }
};

const getApplicantsForJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view applicants for this job",
            });
        }

        const applications = await Application.find({ job: jobId })
            .populate("candidate", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

const updateApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["applied", "reviewed", "shortlisted", "rejected", "hired"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${allowedStatuses.join(", ")}`,
            });
        }

        const application = await Application.findById(id).populate("job");
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        if (application.job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this application",
            });
        }

        application.status = status;
        await application.save();

        const decision = statusToDecision[status];
        if (decision) {
            await RecruiterAction.create({
                recruiter: req.user._id,
                application: application._id,
                decision,
            });
        }

        res.status(200).json({
            success: true,
            message: "Application status updated",
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyApplications,
    applyJob,
    getApplicantsForJob,
    updateApplicationStatus,
};
