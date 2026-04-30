import User from "../models/userModel.js";
import { Project } from "../models/projectModel.js";
import Design from "../models/designModel.js";
import Comment from "../models/commentModel.js";
import Report from "../models/reportModel.js";
import ActivityLog from "../models/activityLogModel.js";

// Helper: Log admin action
const logAdminAction = async (admin, action, targetType, targetId, targetDetails = "", details = {}, ipAddress = "") => {
  try {
    await ActivityLog.create({
      admin,
      action,
      targetType,
      targetId,
      targetDetails,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error("Error logging admin action:", error.message);
  }
};

// Get platform stats
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments({ isActive: true });
    const totalCollaborations = await Project.countDocuments({ collaborators: { $exists: true, $ne: [] } });
    const suspendedUsers = await User.countDocuments({ isActive: false });
    const pendingReports = await Report.countDocuments({ status: "pending" });

    res.json({
      stats: {
        totalUsers,
        totalProjects,
        activeProjects: totalProjects,
        totalCollaborations,
        collaborationCount: totalCollaborations,
        suspendedUsers,
        activeUsers: totalUsers - suspendedUsers,
        pendingReports,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// Get all users (paginated, searchable)
export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Suspend/Unsuspend user
export const toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    // Log action
    await logAdminAction(
      req.user._id,
      user.isActive ? "unsuspend-user" : "suspend-user",
      "user",
      user._id,
      user.username,
      { newStatus: user.isActive },
      req.ip
    );

    res.json({
      message: user.isActive ? "User unsuspended" : "User suspended",
      user: { _id: user._id, username: user.username, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ message: "Error suspending user", error: error.message });
  }
};

// Delete user (hard delete)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete/soft-delete user's projects
    await Project.updateMany({ owner: req.params.id }, { isActive: false });

    // Log action
    await logAdminAction(
      req.user._id,
      "delete-user",
      "user",
      user._id,
      user.username,
      { userEmail: user.email },
      req.ip
    );

    res.json({ message: "User deleted", user: { _id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// Promote user to admin
export const promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already admin" });
    }

    user.role = "admin";
    await user.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "promote-admin",
      "user",
      user._id,
      user.username,
      { previousRole: "user", newRole: "admin" },
      req.ip
    );

    res.json({
      message: "User promoted to admin",
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error promoting user", error: error.message });
  }
};

// Get all projects (admin search/filter)
export const getAllProjects = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    let query = {};
    const skip = (page - 1) * limit;

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await Project.find(query)
      .populate("owner", "username email")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

// Remove/soft-delete project (admin)
export const removeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isActive = false;
    await project.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "remove-project",
      "project",
      project._id,
      project.title,
      { owner: project.owner },
      req.ip
    );

    res.json({ message: "Project removed", project: { _id: project._id, title: project.title } });
  } catch (error) {
    res.status(500).json({ message: "Error removing project", error: error.message });
  }
};

// PHASE 2: Demote admin to user
export const demoteAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    user.role = "user";
    await user.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "demote-admin",
      "user",
      user._id,
      user.username,
      { previousRole: "admin", newRole: "user" },
      req.ip
    );

    res.json({
      message: "Admin demoted to user",
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error demoting admin", error: error.message });
  }
};

// PHASE 2: Restore deleted project
export const restoreProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.isActive) {
      return res.status(400).json({ message: "Project is not deleted" });
    }

    project.isActive = true;
    await project.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "restore-project",
      "project",
      project._id,
      project.title,
      { owner: project.owner },
      req.ip
    );

    res.json({
      message: "Project restored",
      project: { _id: project._id, title: project.title, isActive: project.isActive },
    });
  } catch (error) {
    res.status(500).json({ message: "Error restoring project", error: error.message });
  }
};

// PHASE 2: Get all designs for moderation
export const getAllDesigns = async (req, res) => {
  try {
    const { search, approved, page = 1, limit = 10 } = req.query;
    let query = {};
    const skip = (page - 1) * limit;

    if (approved !== undefined) {
      query.isApproved = approved === "true";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const designs = await Design.find(query)
      .populate("owner", "username email")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Design.countDocuments(query);

    res.json({
      designs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching designs", error: error.message });
  }
};

// PHASE 2: Approve design
export const approveDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    design.isApproved = true;
    design.rejectionReason = null;
    await design.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "approve-design",
      "design",
      design._id,
      design.title,
      { owner: design.owner },
      req.ip
    );

    res.json({ message: "Design approved", design: { _id: design._id, title: design.title, isApproved: design.isApproved } });
  } catch (error) {
    res.status(500).json({ message: "Error approving design", error: error.message });
  }
};

// PHASE 2: Reject design
export const rejectDesign = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    design.isApproved = false;
    design.rejectionReason = reason;
    await design.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "reject-design",
      "design",
      design._id,
      design.title,
      { owner: design.owner, reason },
      req.ip
    );

    res.json({ message: "Design rejected", design: { _id: design._id, title: design.title, isApproved: design.isApproved, rejectionReason: design.rejectionReason } });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting design", error: error.message });
  }
};

// PHASE 2: Get all comments for moderation
export const getAllComments = async (req, res) => {
  try {
    const { approved, page = 1, limit = 10 } = req.query;
    let query = {};
    const skip = (page - 1) * limit;

    if (approved !== undefined) {
      query.isApproved = approved === "true";
    }

    const comments = await Comment.find(query)
      .populate("author", "username email")
      .populate("project", "title")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(query);

    res.json({
      comments,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// PHASE 2: Approve comment
export const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isApproved = true;
    comment.rejectionReason = null;
    await comment.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "approve-comment",
      "comment",
      comment._id,
      comment.text.substring(0, 50),
      { author: comment.author },
      req.ip
    );

    res.json({ message: "Comment approved", comment: { _id: comment._id, isApproved: comment.isApproved } });
  } catch (error) {
    res.status(500).json({ message: "Error approving comment", error: error.message });
  }
};

// PHASE 2: Reject comment
export const rejectComment = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isApproved = false;
    comment.rejectionReason = reason;
    await comment.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "reject-comment",
      "comment",
      comment._id,
      comment.text.substring(0, 50),
      { author: comment.author, reason },
      req.ip
    );

    res.json({ message: "Comment rejected", comment: { _id: comment._id, isApproved: comment.isApproved, rejectionReason: comment.rejectionReason } });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting comment", error: error.message });
  }
};

// PHASE 2: Get all reports
export const getAllReports = async (req, res) => {
  try {
    const { status, reportType, page = 1, limit = 10 } = req.query;
    let query = {};
    const skip = (page - 1) * limit;

    if (status) query.status = status;
    if (reportType) query.reportType = reportType;

    const reports = await Report.find(query)
      .populate("reportedBy", "username email")
      .populate("resolution.resolvedBy", "username")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};

// PHASE 2: Resolve report
export const resolveReport = async (req, res) => {
  try {
    const { action, adminNotes } = req.body;

    if (!action || !["removed", "suspended", "warning", "no-action"].includes(action)) {
      return res.status(400).json({ message: "Invalid resolution action" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "resolved";
    report.resolution = {
      action,
      resolvedBy: req.user._id,
      resolvedAt: new Date(),
      adminNotes: adminNotes || "",
    };
    await report.save();

    // Log action
    await logAdminAction(
      req.user._id,
      "resolve-report",
      "report",
      report._id,
      `Report on ${report.reportType}`,
      { action, reason: report.reason },
      req.ip
    );

    res.json({ message: "Report resolved", report });
  } catch (error) {
    res.status(500).json({ message: "Error resolving report", error: error.message });
  }
};

// PHASE 2: Get admin activity logs
export const getActivityLogs = async (req, res) => {
  try {
    const { action, targetType, admin, page = 1, limit = 20 } = req.query;
    let query = {};
    const skip = (page - 1) * limit;

    if (action) query.action = action;
    if (targetType) query.targetType = targetType;
    if (admin) query.admin = admin;

    const logs = await ActivityLog.find(query)
      .populate("admin", "username")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      logs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity logs", error: error.message });
  }
};
