import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "suspend-user",
        "unsuspend-user",
        "delete-user",
        "promote-admin",
        "demote-admin",
        "remove-project",
        "restore-project",
        "approve-design",
        "reject-design",
        "approve-comment",
        "reject-comment",
        "resolve-report",
      ],
      required: true,
    },
    targetType: {
      type: String,
      enum: ["user", "project", "design", "comment", "report"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetDetails: {
      type: String,
      maxlength: 300,
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
