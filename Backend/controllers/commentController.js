import Comment from "../models/commentModel.js";
import { Project } from "../models/projectModel.js";
import Notification from "../models/notificationModel.js";

// Add comment
export const addComment = async (req, res) => {
  try {
    const { projectId, text } = req.body;

    if (!projectId || !text) {
      return res.status(400).json({ message: "Project ID and text are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const comment = await Comment.create({
      project: projectId,
      author: req.user._id,
      text,
    });

    await comment.populate("author", "username avatar");

    // Create notification (not for own project comments)
    if (project.owner.toString() !== req.user._id.toString()) {
      await Notification.create({
        to: project.owner,
        from: req.user._id,
        type: "comment",
        project: projectId,
        comment: comment._id,
      });
    }

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// Get comments for a project
export const getComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const comments = await Comment.find({ project: projectId })
      .populate("author", "username avatar roles")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({ project: projectId });

    res.json({
      comments,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// Delete comment (author only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};
