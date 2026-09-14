import { useEffect, useState } from "react";
import { getJobs } from "../../api/jobApi";
import JobCard from "../../components/jobs/JobCard";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getJobs();

      // Backend returns { success, count, data }
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Could not load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchTerm = search.toLowerCase();

    return (
      job.title?.toLowerCase().includes(searchTerm) ||
      job.company?.toLowerCase().includes(searchTerm) ||
      job.location?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Find your next role
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Browse open positions from verified recruiters.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border rounded-md px-4 py-2 mb-8"
      />

      {loading && <p>Loading jobs...</p>}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <p>No jobs found.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}