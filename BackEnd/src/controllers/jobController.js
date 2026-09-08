const Job = require("../models/Job");

const createJob = async (req, res, next) => {
    try {
        if (req.user.identityStatus !== "verified") {
            return res.status(403).json({
                success: false,
                message:
                    "You must upload and verify your Aadhar card and PAN card before posting a job.",
                identityStatus: req.user.identityStatus,
            });
        }

        const { title, company, location, description, requirements, jobType, salary } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            description,
            requirements,
            jobType,
            salary,
            recruiter: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiter", "name email role");
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job is not found",
            });
        }
        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

const updateJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      })
    }
    // for check job ownership
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own jobs."
      })
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      data: updatedJob
    })

  } catch (error) {
    next(error);
  }
}

// DELETE /jobs/:id — recruiter deletes their own job posting
// NOTE: does not cascade-delete related Application documents.
// If a job with existing applications is deleted, those Application docs
// become orphaned (their `job` ref will resolve to null on populate).
// Revisit this if you want cascade-delete or a block-if-applications-exist rule.
const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your own jobs.",
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// GET /jobs/my-jobs — recruiter's own posted jobs
const getMyPostedJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createJob, getJobs, getSingleJob, updateJob, deleteJob, getMyPostedJobs };
