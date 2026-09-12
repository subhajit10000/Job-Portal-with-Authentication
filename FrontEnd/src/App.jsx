import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import JobListings from "./pages/candidate/JobListings";
import JobDetails from "./pages/candidate/JobDetails";
import MyApplications from "./pages/candidate/MyApplications";
import Profile from "./pages/candidate/Profile";
import PostJob from "./pages/recruiter/PostJob";
import MyJobPosts from "./pages/recruiter/MyJobPosts";
import ViewApplicants from "./pages/recruiter/ViewApplicants";
import VerifyIdentity from "./pages/recruiter/VerifyIdentity";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            <Route
              path="/my-applications"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/post-job"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-jobs"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <MyJobPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-jobs/:id/applicants"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <ViewApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-identity"
              element={
                <ProtectedRoute allowedRole="recruiter">
                  <VerifyIdentity />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
          </main>
          <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
