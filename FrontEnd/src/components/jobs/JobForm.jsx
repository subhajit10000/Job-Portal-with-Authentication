import { useState } from "react";

const initialState = {
  title: "",
  company: "",
  location: "",
  jobType: "Full-time",
  salary: "",
  description: "",
  requirements: "",
};

const inputClass =
  "w-full mt-1 border border-(--color-border) bg-(--color-bg) text-(--color-text) rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-(--color-navy)/50 focus:border-(--color-navy) transition";

export default function JobForm({
  initialData,
  onSubmit,
  submitLabel = "Post Job",
}) {
  const [form, setForm] = useState(initialData || initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      return setError("Job title is required.");
    }

    if (!form.description.trim()) {
      return setError("Job description is required.");
    }

    if (!onSubmit) {
      return setError("Submit function not found.");
    }

    try {
      setLoading(true);

      await onSubmit(form);

      if (!initialData) {
        setForm(initialState);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface rounded-2xl p-6 max-w-3xl mx-auto space-y-5"
    >
      {error && (
        <div className="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="font-medium text-(--color-text)">Job Title *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-(--color-text)">Company</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="font-medium text-(--color-text)">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-(--color-text)">Job Type</label>

          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className={inputClass}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
            <option>Remote</option>
          </select>
        </div>

        <div>
          <label className="font-medium text-(--color-text)">Salary</label>

          <input
            type="text"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="font-medium text-(--color-text)">Description *</label>

        <textarea
          rows={5}
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="font-medium text-(--color-text)">Requirements</label>

        <textarea
          rows={4}
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white px-6 py-2.5 font-bold shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-50"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
