import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "To user is required"],
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "From user is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["join_request", "invite", "accepted", "declined", "like", "comment", "follow"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
