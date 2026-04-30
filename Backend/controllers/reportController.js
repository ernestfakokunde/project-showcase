import Report from "../models/reportModel.js";
import User from "../models/userModel.js";
import { Project } from "../models/projectModel.js";
import Design from "../models/designModel.js";
import Comment from "../models/commentModel.js";

/**
 * Create a report for content (project, design, comment) or user
 * POST /api/reports/create
 */
export const createReport = async (req, res) => {
  try {
    const { reportType, reportedItem, reason, description } = req.body;

    // Validate input
    if (!reportType || !reportedItem || !reason) {
      return res.status(400).json({
        message: "reportType, reportedItem, and reason are required",
      });
    }

    const validReportTypes = ["design", "comment", "project", "user"];
    if (!validReportTypes.includes(reportType)) {
      return res.status(400).json({
        message: `reportType must be one of: ${validReportTypes.join(", ")}`,
      });
    }

    const validReasons = [
      "Inappropriate content",
      "Spam",
      "Copyright violation",
      "Hate speech",
      "Harassment",
      "Misleading info",
      "Other",
    ];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        message: `reason must be one of: ${validReasons.join(", ")}`,
      });
    }

    // Check if item exists
    let item;
    if (reportType === "project") {
      item = await Project.findById(reportedItem);
    } else if (reportType === "design") {
      item = await Design.findById(reportedItem);
    } else if (reportType === "comment") {
      item = await Comment.findById(reportedItem);
    } else if (reportType === "user") {
      item = await User.findById(reportedItem);
    }

    if (!item) {
      return res.status(404).json({
        message: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} not found`,
      });
    }

    // Check if user already reported this
    const existingReport = await Report.findOne({
      reportType,
      reportedItem,
      reportedBy: req.user._id,
      status: { $in: ["pending", "approved"] },
    });

    if (existingReport) {
      return res.status(400).json({
        message: "You have already reported this item",
      });
    }

    // Create report
    const report = await Report.create({
      reportType,
      reportedItem,
      reportedBy: req.user._id,
      reason,
      description: description || "",
      status: "pending",
    });

    // Populate the report
    const populatedReport = await report
      .populate("reportedBy", "username email")
      .populate("reportedItem");

    res.status(201).json({
      message: "Report submitted successfully",
      report: populatedReport,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({
      message: "Error creating report",
      error: error.message,
    });
  }
};

/**
 * Get user's reports
 * GET /api/reports/my-reports
 */
export const getMyReports = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 10 } = req.query;

    let query = { reportedBy: req.user._id };
    if (status !== "all") {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate("reportedBy", "username email")
      .populate("reportedItem")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching reports",
      error: error.message,
    });
  }
};

/**
 * Get report by ID
 * GET /api/reports/:id
 */
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reportedBy", "username email")
      .populate("reportedItem")
      .populate("resolution.resolvedBy", "username email");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Check if user is the reporter or admin
    if (
      report.reportedBy._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to view this report" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching report",
      error: error.message,
    });
  }
};

/**
 * Delete own report (only pending reports)
 * DELETE /api/reports/:id
 */
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Only reporter can delete, and only if pending
    if (report.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this report" });
    }

    if (report.status !== "pending") {
      return res.status(400).json({
        message: "Can only delete pending reports",
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting report",
      error: error.message,
    });
  }
};
