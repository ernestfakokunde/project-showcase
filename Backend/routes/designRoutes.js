import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  likeDesign,
  saveDesign,
  addCommentToDesign,
  getUserDesigns,
} from "../controllers/designController.js";

const designRoutes = express.Router();

// Public routes
designRoutes.get("/", getDesigns);
designRoutes.get("/user/:userId", getUserDesigns);
designRoutes.get("/:id", getDesignById);

// Protected routes
designRoutes.post("/", protect, createDesign);
designRoutes.put("/:id", protect, updateDesign);
designRoutes.delete("/:id", protect, deleteDesign);
designRoutes.post("/:id/like", protect, likeDesign);
designRoutes.post("/:id/save", protect, saveDesign);
designRoutes.post("/:designId/comments", protect, addCommentToDesign);

export default designRoutes;
