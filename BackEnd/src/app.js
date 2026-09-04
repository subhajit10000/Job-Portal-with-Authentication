const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

// credentials: true + an explicit origin (not "*") are both required for the
// browser to accept/send the httpOnly refreshToken cookie cross-origin.
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Uploaded resumes / identity documents (served as static files)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

// Global error handler — catches every next(error) call from controllers
// and every uncaught error in async routes, and always returns JSON
// (Express's default handler returns HTML, which breaks the frontend's
// err.response?.data?.message reads).
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong",
    });
});

module.exports = app;
