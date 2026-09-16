import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import OtpVerify from "../../components/auth/OtpVerify";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [step, setStep] = useState("form"); // "form" | "otp"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Creates the (unverified) account and emails a 6-digit OTP.
      // No tokens are issued yet — that only happens after verify-otp.
      await registerUser(form);
      setStep("otp");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (user, accessToken) => {
    login(user, accessToken);

    if (user.role === "recruiter") {
      navigate("/post-job");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden hero-gradient py-10">
      <div className="absolute -left-32 top-10 -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      {step === "otp" ? (
        <OtpVerify
          email={form.email}
          onVerified={handleVerified}
          onBack={() => setStep("form")}
        />
      ) : (
        <div className="w-full max-w-md card-surface rounded-2xl p-8 animate-fade-in">
          <h1 className="text-2xl font-black text-(--color-text) mb-2">
            Create your account
          </h1>

          <p className="text-sm text-(--color-text-muted) mb-6">
            Join HirePath as a Candidate or Recruiter.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full border border-(--color-border) bg-(--color-bg) rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-(--color-navy)/50 focus:border-(--color-navy)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-(--color-border) bg-(--color-bg) rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-(--color-navy)/50 focus:border-(--color-navy)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                minLength={6}
                required
                className="w-full border border-(--color-border) bg-(--color-bg) rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-(--color-navy)/50 focus:border-(--color-navy)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                I am a...
              </label>

              <div className="grid grid-cols-2 gap-3">
                {["candidate", "recruiter"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        role,
                      })
                    }
                    className={`rounded-md border py-2 font-medium capitalize transition ${
                      form.role === role
                        ? "bg-linear-to-r from-indigo-600 to-fuchsia-600 text-white border-transparent shadow-md shadow-indigo-500/30"
                        : "border-(--color-border) hover:border-(--color-navy)"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white py-3 font-bold shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-(--color-text-muted)">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-(--color-navy) hover:text-(--color-amber)"
            >
              Log In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
