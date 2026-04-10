import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "From user is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner is required"],
    },
    pitch: {
      type: String,
      required: [true, "Pitch message is required"],
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Unique index — one request per user per project
requestSchema.index({ project: 1, from: 1 }, { unique: true });

export default mongoose.model("Request", requestSchema);
