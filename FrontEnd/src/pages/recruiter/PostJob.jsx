import { Link, useNavigate } from "react-router-dom";
import { createJob } from "../../api/jobApi";
import JobForm from "../../components/jobs/JobForm";
import { useAuth } from "../../context/AuthContext";

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreate = async (formData) => {
    try {
      const response = await createJob(formData);

      console.log("Job created:", response.data);

      alert("Job posted successfully!");

      navigate("/my-jobs");
    } catch (err) {
      console.error("Error:", err);

      if (err.response) {
        alert(err.response.data.message || "Failed to create job.");
      } else if (err.request) {
        alert("Unable to connect to the backend server.");
      } else {
        alert(err.message);
      }

      throw err;
    }
  };

  if (user?.identityStatus !== "verified") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-(--color-navy) mb-2">
          Post a New Job
        </h1>

        <div className="card-surface rounded-xl p-6 mt-6">
          <p className="text-4xl mb-3">🪪</p>
          <h2 className="font-display font-bold text-lg mb-2">
            Identity verification required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            To keep job listings trustworthy, recruiters must upload their Aadhar card and
            PAN card before posting a job. It only takes a minute.
          </p>
          <Link
            to="/verify-identity"
            className="inline-block bg-(--color-amber) text-(--color-navy-dark) font-semibold px-6 py-2.5 rounded-md hover:brightness-95 transition"
          >
            Verify My Identity
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-(--color-navy) mb-2">
        Post a New Job
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Fill in the details below to publish a job opening.
      </p>

      <JobForm
        onSubmit={handleCreate}
        submitLabel="Post Job"
      />
    </div>
  );
}