const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Base uploads directory: BackEnd/uploads/{resumes,identity}
const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads");
const RESUME_DIR = path.join(UPLOAD_ROOT, "resumes");
const IDENTITY_DIR = path.join(UPLOAD_ROOT, "identity");

[RESUME_DIR, IDENTITY_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const safeSuffix = () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

const makeStorage = (dir) =>
    multer.diskStorage({
        destination: (req, file, cb) => cb(null, dir),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${req.user._id}-${safeSuffix()}${ext}`);
        },
    });

const resumeFileFilter = (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
        return cb(new Error("Resume must be a PDF, DOC, or DOCX file"));
    }
    cb(null, true);
};

const identityFileFilter = (req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
        return cb(new Error("ID documents must be a PDF, JPG, or PNG file"));
    }
    cb(null, true);
};

const uploadResume = multer({
    storage: makeStorage(RESUME_DIR),
    fileFilter: resumeFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("resume");

const uploadIdentity = multer({
    storage: makeStorage(IDENTITY_DIR),
    fileFilter: identityFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
}).fields([
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
]);

// Wrap multer callback-style middleware so multer errors (wrong type, too
// large, etc.) come back as clean JSON instead of crashing / HTML errors.
const wrap = (middleware) => (req, res, next) => {
    middleware(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed",
            });
        }
        next();
    });
};

module.exports = {
    uploadResume: wrap(uploadResume),
    uploadIdentity: wrap(uploadIdentity),
    RESUME_DIR,
    IDENTITY_DIR,
};
