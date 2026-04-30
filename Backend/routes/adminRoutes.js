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
  demoteAdmin,
  restoreProject,
  getAllDesigns,
  approveDesign,
  rejectDesign,
  getAllComments,
  approveComment,
  rejectComment,
  getAllReports,
  resolveReport,
  getActivityLogs,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin stats
router.get("/stats", protect, adminOnly, getPlatformStats);

// User management
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/suspend", protect, adminOnly, toggleSuspendUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/promote", protect, adminOnly, promoteToAdmin);
router.put("/users/:id/demote", protect, adminOnly, demoteAdmin);

// Project management
router.get("/projects", protect, adminOnly, getAllProjects);
router.delete("/projects/:id", protect, adminOnly, removeProject);
router.put("/projects/:id/restore", protect, adminOnly, restoreProject);

// Design moderation
router.get("/designs", protect, adminOnly, getAllDesigns);
router.put("/designs/:id/approve", protect, adminOnly, approveDesign);
router.put("/designs/:id/reject", protect, adminOnly, rejectDesign);

// Comment moderation
router.get("/comments", protect, adminOnly, getAllComments);
router.put("/comments/:id/approve", protect, adminOnly, approveComment);
router.put("/comments/:id/reject", protect, adminOnly, rejectComment);

// Reports management
router.get("/reports", protect, adminOnly, getAllReports);
router.put("/reports/:id/resolve", protect, adminOnly, resolveReport);

// Activity logs
router.get("/activity-logs", protect, adminOnly, getActivityLogs);

export default router;
