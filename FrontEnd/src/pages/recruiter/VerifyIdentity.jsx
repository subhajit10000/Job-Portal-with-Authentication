import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadIdentity } from "../../api/userApi";
import { SERVER_BASE_URL } from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const statusMeta = {
  not_submitted: {
    label: "Not submitted",
    tone: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300",
  },
  pending: {
    label: "Pending review",
    tone: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300",
  },
  verified: {
    label: "Verified",
    tone: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 text-(--color-success)",
  },
};

export default function VerifyIdentity() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const status = user?.identityStatus || "not_submitted";
  const meta = statusMeta[status] || statusMeta.not_submitted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!aadhar || !pan) {
      setError("Please select both your Aadhar card and PAN card files.");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadIdentity(aadhar, pan);
      const { aadharUrl, panUrl, identityStatus } = res.data.user;
      updateUser({ aadharUrl, panUrl, identityStatus });
      setMessage("Identity verified! You can now post jobs.");
      setAadhar(null);
      setPan(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit identity documents.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-(--color-navy) mb-1">
        Verify Your Identity
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Recruiters must upload a valid Aadhar card and PAN card before posting a job. This
        helps keep listings on HirePath trustworthy for candidates.
      </p>

      <div className="card-surface rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-lg">Verification status</h2>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${meta.tone}`}>
            {meta.label}
          </span>
        </div>

        {status === "verified" && (
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {user.aadharUrl && (
              <a
                href={`${SERVER_BASE_URL}${user.aadharUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-(--color-bg) border border-(--color-border) rounded-lg px-4 py-3 text-sm font-medium hover:border-(--color-navy) transition"
              >
                🪪 View Aadhar card
              </a>
            )}
            {user.panUrl && (
              <a
                href={`${SERVER_BASE_URL}${user.panUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-(--color-bg) border border-(--color-border) rounded-lg px-4 py-3 text-sm font-medium hover:border-(--color-navy) transition"
              >
                🪪 View PAN card
              </a>
            )}
          </div>
        )}

        {message && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-(--color-success) text-sm px-4 py-2 rounded-md mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-(--color-danger) text-sm px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Aadhar Card</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setAadhar(e.target.files?.[0] || null)}
              className="w-full text-sm border border-(--color-border) rounded-md px-3 py-2 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-(--color-navy) file:text-white file:font-semibold file:cursor-pointer cursor-pointer bg-(--color-surface)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">PAN Card</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setPan(e.target.files?.[0] || null)}
              className="w-full text-sm border border-(--color-border) rounded-md px-3 py-2 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-(--color-navy) file:text-white file:font-semibold file:cursor-pointer cursor-pointer bg-(--color-surface)"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-(--color-amber) text-(--color-navy-dark) font-semibold py-2.5 rounded-md hover:brightness-95 transition disabled:opacity-50"
          >
            {uploading
              ? "Submitting..."
              : status === "verified"
              ? "Replace Documents"
              : "Submit for Verification"}
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Accepted formats: PDF, JPG, PNG. Max size 5MB per file. Your documents are only used
          to confirm you're a real recruiter and are never shown to candidates.
        </p>
      </div>

      {status === "verified" && (
        <button
          onClick={() => navigate("/post-job")}
          className="mt-6 text-sm font-semibold text-(--color-navy) dark:text-(--color-amber) hover:text-(--color-amber) transition"
        >
          → Continue to post a job
        </button>
      )}
    </div>
  );
}
