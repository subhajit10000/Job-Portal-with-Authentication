import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import OtpVerify from "../../components/auth/OtpVerify";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [needsVerification, setNeedsVerification] = useState(false);
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

  const goByRole = (user) => {
    if (user.role === "recruiter") {
      navigate("/my-jobs");
    } else {
      navigate("/jobs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginUser(form);

      const { user, accessToken } = result.data;
      login(user, accessToken);
      goByRole(user);
    } catch (err) {
      console.error(err);

      // Account exists and password is correct, but the one-time email OTP
      // from registration was never completed — finish it here instead of
      // requiring every future login to re-verify.
      if (err.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setNeedsVerification(true);
        setError("");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (user, accessToken) => {
    login(user, accessToken);
    goByRole(user);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden hero-gradient py-10">
      <div className="absolute -left-32 top-10 -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      {needsVerification ? (
        <OtpVerify
          email={form.email}
          onVerified={handleVerified}
          onBack={() => setNeedsVerification(false)}
        />
      ) : (
        <div className="w-full max-w-sm card-surface rounded-2xl p-8 animate-fade-in">
          <h1 className="text-2xl font-black text-(--color-text) mb-2">
            Welcome Back
          </h1>

          <p className="text-sm text-(--color-text-muted) mb-6">
            Login to continue to HirePath.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium">
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
              <label className="block mb-1 text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full border border-(--color-border) bg-(--color-bg) rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-(--color-navy)/50 focus:border-(--color-navy)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white py-3 font-bold shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-(--color-text-muted)">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-(--color-navy) hover:text-(--color-amber)"
            >
              Sign Up
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
