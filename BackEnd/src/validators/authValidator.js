const { body } = require("express-validator")
exports.registerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("role")
        .optional()
        .isIn(["candidate", "recruiter"])
        .withMessage("Role must be candidate or recruiter"),
];

exports.loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),
];

exports.verifyOtpValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("Verification code is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("Verification code must be 6 digits")
        .isNumeric()
        .withMessage("Verification code must be numeric"),
];

exports.resendOtpValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),
];
