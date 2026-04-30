import Design from "../models/designModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import { autoFlagContent } from "../utils/contentFilter.js";

// Create design
export const createDesign = async (req, res) => {
  try {
    const { title, description, category, images, tools, tags, links } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Auto-flag content
    const flagResult = autoFlagContent({ title, description, links });

    const design = await Design.create({
      owner: req.user._id,
      title,
      description,
      category,
      images,
      tools: tools || [],
      tags: tags || [],
      links: links || [],
      isFlagged: flagResult.shouldFlag,
      flagLevel: flagResult.flagLevel,
      flags: flagResult.shouldFlag ? flagResult.reasons.map(reason => ({ reason })) : [],
    });

    const populatedDesign = await design.populate("owner", "username email avatar roles");

    // Include flag warning if content was flagged
    const response = {
      message: flagResult.shouldFlag 
        ? "Design created but flagged for moderation review"
        : "Design created successfully",
      design: populatedDesign,
    };

    if (flagResult.shouldFlag) {
      response.flagWarning = {
        level: flagResult.flagLevel,
        reasons: flagResult.reasons,
      };
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error creating design", error: error.message });
  }
};

// Get all designs (feed with filters)
export const getDesigns = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (page - 1) * limit;
    const designs = await Design.find(query)
      .populate("owner", "username avatar roles followers")
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

// Get single design
export const getDesignById = async (req, res) => {
  try {
    const design = await Design.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    )
      .populate("owner", "username avatar bio roles skills links followers following")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" }
      });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json({ design });
  } catch (error) {
    res.status(500).json({ message: "Error fetching design", error: error.message });
  }
};

// Update design (owner only)
export const updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, images, tools, tags, links } = req.body;

    let design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    // Check if user is owner
    if (design.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this design" });
    }

    design = await Design.findByIdAndUpdate(
      id,
      { title, description, category, images, tools, tags, links },
      { returnDocument: 'after', runValidators: true }
    ).populate("owner", "username avatar roles");

    res.json({ message: "Design updated successfully", design });
  } catch (error) {
    res.status(500).json({ message: "Error updating design", error: error.message });
  }
};

// Delete design (owner only)
export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    if (design.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this design" });
    }

    await Design.findByIdAndDelete(req.params.id);

    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting design", error: error.message });
  }
};

// Like design
export const likeDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    if (design.likes.includes(req.user._id)) {
      // Unlike
      design.likes = design.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Like
      design.likes.push(req.user._id);
    }

    await design.save();
    res.json({ message: "Like toggled", design, liked: design.likes.includes(req.user._id) });
  } catch (error) {
    res.status(500).json({ message: "Error liking design", error: error.message });
  }
};

// Save/bookmark design
export const saveDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    if (design.saves.includes(req.user._id)) {
      // Unsave
      design.saves = design.saves.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Save
      design.saves.push(req.user._id);
    }

    await design.save();
    res.json({ message: "Save toggled", design, saved: design.saves.includes(req.user._id) });
  } catch (error) {
    res.status(500).json({ message: "Error saving design", error: error.message });
  }
};

// Add comment to design
export const addCommentToDesign = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const design = await Design.findById(req.params.designId);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    const comment = await Comment.create({
      author: req.user._id,
      text,
      project: req.params.designId,
    });

    design.comments.push(comment._id);
    await design.save();

    const populatedComment = await comment.populate("author", "username avatar");

    res.status(201).json({ message: "Comment added", comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// Get user's designs
export const getUserDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ owner: req.params.userId, isPublished: true })
      .populate("owner", "username avatar roles")
      .sort("-createdAt");

    res.json({ designs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user designs", error: error.message });
  }
};
