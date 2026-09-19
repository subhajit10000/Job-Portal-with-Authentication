import { SERVER_BASE_URL } from "../../api/axiosInstance";

// Backend stores status in lowercase ("applied", "reviewed", "shortlisted",
// "rejected", "hired") per the Application model's enum. This map controls
// both the display label and the badge color, keyed on the real lowercase value.
const statusConfig = {
  applied: { label: "Applied", tone: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900" },
  reviewed: { label: "Reviewed", tone: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900" },
  shortlisted: { label: "Shortlisted", tone: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900" },
  rejected: { label: "Rejected", tone: "bg-red-50 dark:bg-red-950/30 text-[var(--color-danger)] border-red-200 dark:border-red-900" },
  hired: { label: "Hired", tone: "bg-green-50 dark:bg-green-950/30 text-[var(--color-success)] border-green-200 dark:border-green-900" },
};

// Buttons must send lowercase values — the backend's updateApplicationStatus
// controller rejects anything outside ["applied","reviewed","shortlisted","rejected","hired"].
const actionableStatuses = ["reviewed", "shortlisted", "rejected", "hired"];

export default function ApplicationCard({ application, isRecruiterView, onStatusChange }) {
  const status = application.status || "applied";
  const { label, tone } = statusConfig[status] || statusConfig.applied;

  return (
    <div className="card-surface rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-(--color-navy)">
            {isRecruiterView ? application.candidate?.name : application.job?.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isRecruiterView ? application.candidate?.email : application.job?.company}
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tone}`}>
          {label}
        </span>
      </div>

      {application.coverLetter && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{application.coverLetter}</p>
      )}

      {!isRecruiterView && application.resumeOriginalName && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          CV submitted: {application.resumeOriginalName}
        </p>
      )}

      {isRecruiterView && application.resumeUrl && (
        <a
          href={`${SERVER_BASE_URL}${application.resumeUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-navy) dark:text-(--color-amber) hover:text-(--color-amber) transition self-start"
        >
          📄 View CV{application.resumeOriginalName ? ` — ${application.resumeOriginalName}` : ""}
        </a>
      )}

      {isRecruiterView && onStatusChange && (
        <div className="flex gap-2 mt-1">
          {actionableStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(application._id, s)}
              className="text-xs font-medium px-2.5 py-1 rounded-md border border-(--color-border) hover:border-(--color-navy) hover:text-(--color-navy) transition"
            >
              Mark {statusConfig[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
