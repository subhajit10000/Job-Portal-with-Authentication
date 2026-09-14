import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../../api/userApi";
import { SERVER_BASE_URL } from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setError("");
    setMessage("");
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a PDF, DOC, or DOCX file first.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const res = await uploadResume(file);
      const { resumeUrl, resumeOriginalName, resumeUploadedAt } = res.data.user;
      updateUser({ resumeUrl, resumeOriginalName, resumeUploadedAt });
      setMessage("CV uploaded successfully!");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload CV.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-(--color-navy) mb-1">
        My Profile
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Upload your CV/resume once — it's attached automatically whenever you apply to a job.
      </p>

      <div className="card-surface rounded-xl p-6">
        <h2 className="font-display font-bold text-lg mb-4">Curriculum Vitae (CV)</h2>

        {user?.resumeUrl ? (
          <div className="flex items-center justify-between gap-4 bg-(--color-bg) border border-(--color-border) rounded-lg px-4 py-3 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl">📄</span>
              <div className="min-w-0">
                <p className="font-medium truncate">{user.resumeOriginalName || "Your CV"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Currently on file</p>
              </div>
            </div>
            <a
              href={`${SERVER_BASE_URL}${user.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-(--color-navy) dark:text-(--color-amber) hover:text-(--color-amber) transition shrink-0"
            >
              View
            </a>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm px-4 py-3 rounded-lg mb-6">
            You haven't uploaded a CV yet. You'll need one before you can apply to jobs.
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

        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="flex-1 text-sm border border-(--color-border) rounded-md px-3 py-2 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-(--color-navy) file:text-white file:font-semibold file:cursor-pointer cursor-pointer bg-(--color-surface)"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-(--color-amber) text-(--color-navy-dark) font-semibold px-6 py-2 rounded-md hover:brightness-95 transition disabled:opacity-50 shrink-0"
          >
            {uploading ? "Uploading..." : user?.resumeUrl ? "Replace CV" : "Upload CV"}
          </button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Accepted formats: PDF, DOC, DOCX. Max size 5MB.
        </p>
      </div>

      <button
        onClick={() => navigate("/jobs")}
        className="mt-6 text-sm font-semibold text-(--color-navy) dark:text-(--color-amber) hover:text-(--color-amber) transition"
      >
        ← Back to job listings
      </button>
    </div>
  );
}
