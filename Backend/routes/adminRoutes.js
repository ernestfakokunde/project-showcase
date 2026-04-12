import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getPlatformStats,
  getAllUsers,
  toggleSuspendUser,
  deleteUser,
  promoteToAdmin,
  getAllProjects,
  removeProject,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin stats
router.get("/stats", protect, adminOnly, getPlatformStats);

// User management
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/suspend", protect, adminOnly, toggleSuspendUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/promote", protect, adminOnly, promoteToAdmin);

// Project management
router.get("/projects", protect, adminOnly, getAllProjects);
router.delete("/projects/:id", protect, adminOnly, removeProject);

export default router;
