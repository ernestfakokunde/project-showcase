import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createReport,
  getMyReports,
  getReportById,
  deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

// All report routes require authentication
router.use(protect);

// Create a new report
router.post("/create", createReport);

// Get user's reports
router.get("/my-reports", getMyReports);

// Get report by ID
router.get("/:id", getReportById);

// Delete own report
router.delete("/:id", deleteReport);

export default router;
