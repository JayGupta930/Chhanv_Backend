import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import connection from "./config/db.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRouter.js";
import adminRouter from "./router/adminRouter.js";
import doctorRouter from "./router/doctorRouter.js";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import { auditLog } from "./middlewares/auth.js";

const app = express();
config({
  path: "./secret.env", // Load from secret.env instead of .env
});

// More permissive rate limiting for development
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max:
    process.env.RATE_LIMIT_MAX ||
    (process.env.NODE_ENV === "development" ? 1000 : 100),
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration with environment-based origins
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001",
    ];

app.use(
  cors({
    origin: corsOrigins,
    method: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/doctor", doctorRouter);

app.use("/api/v1/user/login", limiter);
app.use("/api/v1/user/register", limiter);
app.use(auditLog);
app.use(helmet());
app.use(mongoSanitize());

connection();
app.use(errorMiddleware);

export default app;
