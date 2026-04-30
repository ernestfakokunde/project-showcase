import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      maxlength: 500,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
