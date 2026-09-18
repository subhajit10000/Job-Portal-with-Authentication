import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-linear-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white sticky top-0 z-10 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-y-2">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-lg">
            💼
          </span>
          Hire<span className="text-(--color-amber)">Path</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium flex-wrap">
          <Link to="/jobs" className="hover:text-(--color-amber) transition-colors">
            Browse Jobs
          </Link>

          {user?.role === "candidate" && (
            <>
              <Link to="/my-applications" className="hover:text-(--color-amber) transition-colors">
                My Applications
              </Link>
              <Link to="/profile" className="hover:text-(--color-amber) transition-colors">
                Verification{user.resumeUrl ? " ✓" : " ?"}
              </Link>
            </>
          )}

          {user?.role === "recruiter" && (
            <>
              <Link to="/post-job" className="hover:text-(--color-amber) transition-colors">
                Post a Job
              </Link>
              <Link to="/my-jobs" className="hover:text-(--color-amber) transition-colors">
                My Job Posts
              </Link>
              <Link to="/verify-identity" className="hover:text-(--color-amber) transition-colors">
                Verification{user.identityStatus === "verified" ? " ✓" : " ?"}
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 13.64 10.64Z" />
              </svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <span className="text-xs uppercase tracking-wide bg-white/10 px-2 py-1 rounded-full">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="bg-(--color-amber) text-(--color-navy-dark) font-semibold px-3 py-1.5 rounded-md hover:brightness-95 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <Link to="/login" className="hover:text-(--color-amber) transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-(--color-amber) text-(--color-navy-dark) font-semibold px-3 py-1.5 rounded-md hover:brightness-95 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
