const User = require("../models/User");
const tokenService = require("../utils/tokenService");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = tokenService.verifyAccessToken(token);

    // Refresh tokens must never be usable as access tokens.
    if (decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: error.name === "TokenExpiredError" ? "ACCESS_TOKEN_EXPIRED" : undefined,
    });
  }
};

module.exports = authMiddleware;
