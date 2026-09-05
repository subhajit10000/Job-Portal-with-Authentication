const express = require("express");

const router = express.Router();

const {
  register,
  login,
  profile,
  verifyOtp,
  resendOtp,
  refreshToken,
  logout,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const {
  registerValidator,
  loginValidator,
  verifyOtpValidator,
  resendOtpValidator,
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");

// Registration is a two-step flow: register -> email OTP -> verify-otp.
// Tokens are only issued once verify-otp succeeds (or on a later login).
router.post("/register", registerValidator, validate, register);
router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);
router.post("/resend-otp", resendOtpValidator, validate, resendOtp);

router.post("/login", loginValidator, validate, login);

// Access/refresh token pair management.
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.get("/profile", authMiddleware, profile);

module.exports = router;
