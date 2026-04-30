import express from "express";
import { registerUser, login, forgotPassword, resetPassword } from "../controllers/authcontroller.js";
import protect from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateProfile,
  toggleFollow,
  getSuggestedUsers,
  searchUsers,
  getCurrentUser,
} from "../controllers/userController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected routes - specific routes FIRST
router.get("/me", protect, getCurrentUser);
router.get("/suggested", protect, getSuggestedUsers);
router.get("/search", protect, searchUsers);
router.put("/profile", protect, updateProfile);
router.put("/:id/follow", protect, toggleFollow);

// Generic routes - LAST (catch-all)
router.get("/:username", protect, getUserProfile);

export default router;
