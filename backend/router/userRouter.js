import express from "express";
import {
  registerUser,
  login,
  adminLogin,
  doctorLogin,
  logout,
  getUserProfile,
  updateUserProfile,
  changePassword,
  addRelative,
  getRelatives,
  updateRelative,
  removeRelative,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", login);

// Admin and Doctor login routes
router.post("/admin/login", adminLogin);
router.post("/doctor/login", doctorLogin);

// Protected routes (require authentication)
router.post("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile/update", isAuthenticated, updateUserProfile);
router.put("/change-password", isAuthenticated, changePassword);

// Relative management routes
router.post("/relatives/add", isAuthenticated, addRelative);
router.get("/relatives", isAuthenticated, getRelatives);
router.put("/relatives/:relativeId", isAuthenticated, updateRelative);
router.delete("/relatives/:relativeId", isAuthenticated, removeRelative);

export default router;
