import { useEffect, useState } from "react";
import { getMyApplications } from "../../api/applicationApi";
import ApplicationCard from "../../components/applications/ApplicationCard";
export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyApplications();
        setApplications(res.data.data);
      } catch (err) {
        setError("Could not load your applications.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-(--color-navy) mb-1">
        My Applications
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Track the status of jobs you've applied to.</p>

      {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-(--color-danger)">{error}</p>}
      {!loading && applications.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">You haven't applied to any jobs yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {applications.map((app) => (
          <ApplicationCard key={app._id} application={app} />
        ))}
      </div>
    </div>
  );
}
