import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicantsForJob, updateApplicationStatus } from "../../api/applicationApi";
import ApplicationCard from "../../components/applications/ApplicationCard";

export default function ViewApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await getApplicantsForJob(id);
      setApplications(res.data.data);
    } catch (err) {
      setError("Could not load applicants.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );
    } catch (err) {
      alert("Could not update status. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-(--color-navy) mb-1">
        Applicants
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Review and update the status of each candidate.</p>

      {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-(--color-danger)">{error}</p>}
      {!loading && applications.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No one has applied to this job yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {applications.map((app) => (
          <ApplicationCard
            key={app._id}
            application={app}
            isRecruiterView
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
