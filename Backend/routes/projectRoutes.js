import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLike,
  toggleSave,
  getSavedProjects,
  getMyProjects,
  getTrendingProjects,
} from "../controllers/projectController.js";

const router = express.Router();

// Feed and trending
router.get("/trending", protect, getTrendingProjects);
router.get("/saved", protect, getSavedProjects);
router.get("/my", protect, getMyProjects);
router.get("/", protect, getProjects);

// CRUD
router.post("/", protect, createProject);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

// Likes and saves
router.put("/:id/like", protect, toggleLike);
router.put("/:id/save", protect, toggleSave);

export default router;
