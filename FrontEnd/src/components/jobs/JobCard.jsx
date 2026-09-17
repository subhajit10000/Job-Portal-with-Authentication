import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="card-surface rounded-xl p-5 hover:-translate-y-0.5 transition-all flex flex-col gap-3">
      <div>
        <h3 className="font-display text-lg font-bold text-(--color-navy)">
          {job.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{job.company || job.recruiter?.name}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {job.location && (
          <span className="bg-(--color-bg) border border-(--color-border) px-2 py-1 rounded-full">
            📍 {job.location}
          </span>
        )}
        {job.jobType && (
          <span className="bg-(--color-bg) border border-(--color-border) px-2 py-1 rounded-full">
            {job.jobType}
          </span>
        )}
        {job.salary && (
          <span className="bg-(--color-bg) border border-(--color-border) px-2 py-1 rounded-full">
            💰 {job.salary}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{job.description}</p>

      <Link
        to={`/jobs/${job._id}`}
        className="mt-2 text-sm font-semibold text-(--color-navy) hover:text-(--color-amber) transition-colors self-start"
      >
        View details →
      </Link>
    </div>
  );
}
