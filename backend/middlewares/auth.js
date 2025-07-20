import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import { User } from "../models/User.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    // In development mode, provide more helpful error messages
    if (process.env.NODE_ENV === "development") {
      console.log("🚫 No token found in cookies");
      console.log("📧 Available cookies:", Object.keys(req.cookies));
    }
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (process.env.NODE_ENV === "development") {
      console.log("🔓 Token decoded successfully for user ID:", decoded.id);
    }

    if (await isTokenRevoked(decoded.id, token)) {
      return next(
        new ErrorHandler("Token has been revoked. Please log in again.", 401)
      );
    }

    req.user = await User.findById(decoded.id).select("+role");

    if (!req.user) {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ User not found in database for ID:", decoded.id);
      }
      return next(new ErrorHandler("User account not found or deleted", 404));
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        "✅ User authenticated:",
        req.user.email,
        "Role:",
        req.user.role
      );
    }

    req.token = token;
    next();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.log("🚫 Token verification failed:", err.message);
    }

    if (err.name === "TokenExpiredError") {
      return next(
        new ErrorHandler("Your session has expired. Please log in again.", 401)
      );
    }
    if (err.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }
    return next(new ErrorHandler("Authentication failed", 401));
  }
});

export const auditLog = (req, res, next) => {
  const userEmail = req.user?.email || "anonymous";
  const userRole = req.user?.role || "unknown";
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${req.method} ${req.originalUrl} by ${userEmail} (${userRole})`;

  if (process.env.NODE_ENV === "development") {
    console.log("📊", logMessage);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log("📝 Request body:", JSON.stringify(req.body, null, 2));
    }
  } else {
    console.log(logMessage);
  }

  next();
};

export const isAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.user.role || req.user.role !== "admin") {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🚫 Admin access denied for user:",
        req.user?.email,
        "Role:",
        req.user?.role
      );
    }
    return next(
      new ErrorHandler("Access denied. Administrator privileges required", 403)
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.log("✅ Admin access granted to:", req.user.email);
  }

  next();
});

const isTokenRevoked = async (userId, token) => {
  return false;
};

export const hasRole = (roles) => {
  return catchAsyncErrors(async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Access denied. Required roles: ${roles.join(", ")}`,
          403
        )
      );
    }
    next();
  });
};

export const hasPermission = (permission) => {
  return catchAsyncErrors(async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required", 401));
    }
    next();
  });
};
