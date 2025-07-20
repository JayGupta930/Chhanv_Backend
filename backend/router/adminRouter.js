import express from "express";
import {
  createCamp,
  getAllCamps,
  getCampById,
  updateCamp,
  deleteCamp,
  upComingCamps,
  pastCampsCount,
  upComingCampsCount,
  thisMonthCampsCount,
} from "../controllers/adminController.js";
import { adminLogin, logout } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Admin authentication

router.post("/login", adminLogin);
router.post("/logout", isAuthenticated, logout);

// All admin routes require authentication
router.post("/camps/create", isAuthenticated, createCamp);
router.get("/camps/all", isAuthenticated, getAllCamps);
router.get("/camps/:id", isAuthenticated, getCampById);
router.put("/camps/:id", isAuthenticated, updateCamp);
router.delete("/camps/:id", isAuthenticated, deleteCamp);

// Camp queries
router.get("/camps/upcoming", isAuthenticated, upComingCamps);

// Statistics endpoints
router.get("/camps/past/count", isAuthenticated, pastCampsCount);
router.get("/camps/upcoming/count", isAuthenticated, upComingCampsCount);
router.get("/camps/thismonth/count", isAuthenticated, thisMonthCampsCount);

export default router;
