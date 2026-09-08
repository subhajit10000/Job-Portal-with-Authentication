const bcrypt = require("bcryptjs");
const User = require("../models/User");
const otpService = require("../utils/otpService");
const tokenService = require("../utils/tokenService");
const { sendOtpEmail } = require("../config/mailer");

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    resumeUrl: user.resumeUrl,
    identityStatus: user.identityStatus,
});

// Generates a fresh OTP, stores its hash + expiry on the user, and emails it.
const issueAndSendOtp = async (user) => {
    const otp = otpService.generateOtp();

    user.otpCodeHash = await otpService.hashOtp(otp);
    user.otpExpiresAt = otpService.otpExpiryDate();
    user.otpLastSentAt = new Date();
    user.otpAttempts = 0;
    await user.save();

    await sendOtpEmail({
        to: user.email,
        name: user.name,
        otp,
        expiryMinutes: otpService.OTP_EXPIRY_MINUTES,
    });
};

// POST /api/auth/register — creates the account (unverified) and emails an OTP.
// No tokens are issued here; the account can't log in until /verify-otp succeeds.
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isEmailVerified) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists",
                });
            }

            // Previous attempt never finished email verification — let them
            // pick up where they left off instead of being locked out forever.
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.role = role || existingUser.role;
            await issueAndSendOtp(existingUser);

            return res.status(201).json({
                success: true,
                message: "Registration successful. A verification code has been sent to your email.",
                email: existingUser.email,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await issueAndSendOtp(user);

        res.status(201).json({
            success: true,
            message: "Registration successful. A verification code has been sent to your email.",
            email: user.email,
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/verify-otp — one-time step, only ever needed right after
// registration. Once isEmailVerified flips to true it is never re-checked
// on subsequent logins.
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email }).select(
            "+otpCodeHash +otpExpiresAt +otpAttempts +refreshTokens"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found for this email",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified. Please log in.",
            });
        }

        if (!user.otpCodeHash || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Code has expired. Please request a new one.",
            });
        }

        if (user.otpAttempts >= otpService.OTP_MAX_ATTEMPTS) {
            return res.status(429).json({
                success: false,
                message: "Too many incorrect attempts. Please request a new code.",
            });
        }

        const isMatch = await otpService.compareOtp(otp, user.otpCodeHash);
        if (!isMatch) {
            user.otpAttempts += 1;
            await user.save();
            return res.status(400).json({
                success: false,
                message: "Incorrect verification code",
            });
        }

        user.isEmailVerified = true;
        user.otpCodeHash = null;
        user.otpExpiresAt = null;
        user.otpLastSentAt = null;
        user.otpAttempts = 0;

        const { accessToken, refreshToken } = await tokenService.issueTokenPair(user);
        res.cookie("refreshToken", refreshToken, tokenService.refreshCookieOptions());

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: sanitizeUser(user),
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/resend-otp
exports.resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email }).select("+otpLastSentAt");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found for this email",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified. Please log in.",
            });
        }

        if (user.otpLastSentAt) {
            const secondsSinceLast = (Date.now() - user.otpLastSentAt.getTime()) / 1000;
            if (secondsSinceLast < otpService.OTP_RESEND_COOLDOWN_SECONDS) {
                const retryAfter = Math.ceil(
                    otpService.OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLast
                );
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${retryAfter}s before requesting a new code.`,
                    retryAfter,
                });
            }
        }

        await issueAndSendOtp(user);

        res.status(200).json({
            success: true,
            message: "A new verification code has been sent to your email.",
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login — verification is required once (at registration),
// never re-required here on subsequent logins once the account is verified.
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                code: "EMAIL_NOT_VERIFIED",
                message: "Please verify your email before logging in.",
                email: user.email,
            });
        }

        const { accessToken, refreshToken } = await tokenService.issueTokenPair(user);
        res.cookie("refreshToken", refreshToken, tokenService.refreshCookieOptions());

        res.status(200).json({
            success: true,
            user: sanitizeUser(user),
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/refresh-token — exchanges a valid refresh token (cookie or
// body) for a new access token, rotating the refresh token in the process.
exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing",
            });
        }

        let decoded;
        try {
            decoded = tokenService.verifyRefreshToken(token);
        } catch {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        const user = await User.findById(decoded.id).select("+refreshTokens");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const tokenHash = tokenService.hashToken(token);
        const matchIndex = (user.refreshTokens || []).findIndex(
            (entry) => entry.tokenHash === tokenHash && entry.expiresAt > new Date()
        );

        if (matchIndex === -1) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not recognized. Please log in again.",
            });
        }

        // Rotation: the used token is removed and a brand new pair issued.
        user.refreshTokens.splice(matchIndex, 1);
        const { accessToken, refreshToken } = await tokenService.issueTokenPair(user);
        res.cookie("refreshToken", refreshToken, tokenService.refreshCookieOptions());

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/logout — revokes just the current session's refresh token.
exports.logout = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;

        if (token) {
            try {
                const decoded = tokenService.verifyRefreshToken(token);
                const user = await User.findById(decoded.id).select("+refreshTokens");
                if (user) {
                    const tokenHash = tokenService.hashToken(token);
                    user.refreshTokens = (user.refreshTokens || []).filter(
                        (entry) => entry.tokenHash !== tokenHash
                    );
                    await user.save();
                }
            } catch {
                // Already invalid/expired — nothing left to revoke.
            }
        }

        res.clearCookie("refreshToken", { path: "/api/auth" });
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};

exports.profile = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
};
