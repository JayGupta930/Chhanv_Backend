import express from "express";
import {
  createDoctor,
  createHealthReport,
  getDoctorHealthReports,
  getHealthReportById,
  updateHealthReport,
  deleteHealthReport,
  getPatientHealthReports,
  getRelativeHealthReports,
  getAllHealthReports,
} from "../controllers/doctorController.js";
import { doctorLogin, logout } from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Doctor authentication

router.post("/login", doctorLogin);
router.post("/logout", isAuthenticated, logout);

// Doctor Management (now protected)
router.post("/", isAuthenticated, isAdmin, createDoctor);

// Health Report Management Routes (all require authentication)
router.post("/health-reports/create", isAuthenticated, createHealthReport);
router.get("/health-reports", isAuthenticated, getDoctorHealthReports);
router.get("/health-reports/all", isAuthenticated, getAllHealthReports);
router.get("/health-reports/:reportId", isAuthenticated, getHealthReportById);
router.put("/health-reports/:reportId", isAuthenticated, updateHealthReport);
router.delete("/health-reports/:reportId", isAuthenticated, deleteHealthReport);

// Patient Health Reports
router.get(
  "/patients/:patientId/health-reports",
  isAuthenticated,
  getPatientHealthReports
);
router.get(
  "/patients/:patientId/relatives/:relativeId/health-reports",
  isAuthenticated,
  getRelativeHealthReports
);

export default router;