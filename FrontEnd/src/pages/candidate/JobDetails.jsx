import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById } from "../../api/jobApi";
import { applyToJob } from "../../api/applicationApi";
import { useAuth } from "../../context/AuthContext";
export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data.data);
      } catch (err) {
        setError("Job not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setApplying(true);
    setError("");
    try {
      await applyToJob(id, { coverLetter });
      setMessage("Application submitted successfully!");
      setCoverLetter("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="text-gray-500 dark:text-gray-400 px-6 py-10">Loading job...</p>;
  if (!job) return <p className="text-(--color-danger) px-6 py-10">{error || "Job not found."}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-(--color-navy)">{job.title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        {job.company} {job.location && `· ${job.location}`}
      </p>

      <div className="flex flex-wrap gap-2 my-4 text-xs">
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

      <div className="card-surface rounded-xl p-6 mt-6">
        <h2 className="font-display font-bold text-lg mb-2">Description</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>

        {job.requirements && (
          <>
            <h2 className="font-display font-bold text-lg mt-5 mb-2">Requirements</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.requirements}</p>
          </>
        )}
      </div>

      {(!user || user.role === "candidate") && (
        <div className="card-surface rounded-xl p-6 mt-6">
          <h2 className="font-display font-bold text-lg mb-3">Apply for this job</h2>

          {message && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-(--color-success) text-sm px-3 py-2 rounded-md mb-4">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-(--color-danger) text-sm px-3 py-2 rounded-md mb-4">
              {error}
            </div>
          )}

          {user && user.role === "candidate" && !user.resumeUrl ? (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm px-4 py-3 rounded-lg flex items-center justify-between gap-4 flex-wrap">
              <span>Upload your CV before applying to jobs.</span>
              <Link
                to="/profile"
                className="font-semibold underline underline-offset-2 whitespace-nowrap"
              >
                Upload CV →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleApply} className="flex flex-col gap-3">
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                placeholder="Add a short cover letter (optional)"
                className="w-full border border-(--color-border) rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-(--color-amber) outline-none bg-(--color-surface)"
              />
              <button
                type="submit"
                disabled={applying}
                className="bg-(--color-amber) text-(--color-navy-dark) font-semibold px-4 py-2 rounded-md hover:brightness-95 transition disabled:opacity-50 self-start"
              >
                {applying ? "Submitting..." : user ? "Apply Now" : "Log in to Apply"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
