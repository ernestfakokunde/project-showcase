import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ["design", "comment", "project", "user"],
      required: true,
    },
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "reportType",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "Inappropriate content",
        "Spam",
        "Copyright violation",
        "Hate speech",
        "Harassment",
        "Misleading info",
        "Other",
      ],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "resolved"],
      default: "pending",
    },
    resolution: {
      action: {
        type: String,
        enum: ["removed", "suspended", "warning", "no-action"],
        default: null,
      },
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      resolvedAt: {
        type: Date,
        default: null,
      },
      adminNotes: {
        type: String,
        maxlength: 500,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
