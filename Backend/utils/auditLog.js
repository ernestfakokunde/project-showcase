import ActivityLog from "../models/activityLogModel.js";

/**
 * Log admin activity
 * Tracks all sensitive operations for audit trail
 */
export const logActivity = async (adminId, action, details = {}) => {
  try {
    await ActivityLog.create({
      admin: adminId,
      action,
      details,
      timestamp: new Date(),
      ipAddress: details.ipAddress || "unknown",
      userAgent: details.userAgent || "unknown",
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

/**
 * Log user-related activities
 */
export const logUserActivity = (adminId, action, userId, reason = "") => {
  return logActivity(adminId, `user_${action}`, {
    targetUserId: userId,
    reason,
  });
};

/**
 * Log project-related activities
 */
export const logProjectActivity = (adminId, action, projectId, reason = "") => {
  return logActivity(adminId, `project_${action}`, {
    targetProjectId: projectId,
    reason,
  });
};

/**
 * Log design-related activities
 */
export const logDesignActivity = (adminId, action, designId, reason = "") => {
  return logActivity(adminId, `design_${action}`, {
    targetDesignId: designId,
    reason,
  });
};

/**
 * Log comment-related activities
 */
export const logCommentActivity = (adminId, action, commentId, reason = "") => {
  return logActivity(adminId, `comment_${action}`, {
    targetCommentId: commentId,
    reason,
  });
};

/**
 * Log report resolution
 */
export const logReportResolution = (adminId, reportId, action, adminNotes = "") => {
  return logActivity(adminId, `report_${action}`, {
    reportId,
    adminNotes,
  });
};

/**
 * Log account security events (password reset, login attempts, etc.)
 */
export const logSecurityEvent = (userId, eventType, details = {}) => {
  return ActivityLog.create({
    admin: userId,
    action: `security_${eventType}`,
    details,
    timestamp: new Date(),
  }).catch((error) => {
    console.error("Error logging security event:", error);
  });
};

/**
 * Get activity logs with filtering
 */
export const getActivityLogs = async (filters = {}, page = 1, limit = 50) => {
  try {
    let query = {};

    if (filters.admin) query.admin = filters.admin;
    if (filters.action) query.action = new RegExp(filters.action, "i");
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    const logs = await ActivityLog.find(query)
      .populate("admin", "username email")
      .sort("-timestamp")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ActivityLog.countDocuments(query);

    return {
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return { logs: [], pagination: {} };
  }
};

/**
 * Export logs for audit purposes
 */
export const exportActivityLogs = async (filters = {}) => {
  try {
    let query = {};
    if (filters.admin) query.admin = filters.admin;
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    return await ActivityLog.find(query)
      .populate("admin", "username email")
      .sort("-timestamp")
      .lean();
  } catch (error) {
    console.error("Error exporting logs:", error);
    return [];
  }
};
