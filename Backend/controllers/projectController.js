import { Project } from "../models/projectModel.js";
import User from "../models/userModel.js";
import Request from "../models/requestModel.js";
import Notification from "../models/notificationModel.js";

// Create project
export const createProject = async (req, res) => {
  try {
    const { title, description, category, techStack, tools, experienceLevel, projectStage, chain, roles, links } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    const project = await Project.create({
      owner: req.user._id,
      title,
      description,
      category,
      techStack: techStack || [],
      tools: tools || [],
      experienceLevel: experienceLevel || "",
      projectStage: projectStage || "",
      chain: chain || "",
      roles: roles || [],
      links: links || [],
    });

    const populatedProject = await project.populate("owner", "username email avatar");

    res.status(201).json({ message: "Project created successfully", project: populatedProject });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// Get all projects (feed with filters)
export const getProjects = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const projects = await Project.find(query)
      .populate("owner", "username email avatar")
      .populate("collaborators", "username avatar")
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

// Get single project
export const getProjectById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findById(req.params.id)
      .populate("owner", "username email avatar bio roles skills links")
      .populate("collaborators", "username avatar roles");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is collaborator to show hidden links
    const isCollaborator = project.collaborators.some((c) => c._id.toString() === req.user._id.toString());

    res.json({ project, isCollaborator });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ 
      message: "Error fetching project", 
      error: error.message,
      details: "Check server logs for more information"
    });
  }
};

// Update project (owner only)
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    const { title, description, category, techStack, tools, experienceLevel, projectStage, chain, roles, links, coverImage } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (techStack) project.techStack = techStack;
    if (tools) project.tools = tools;
    if (experienceLevel) project.experienceLevel = experienceLevel;
    if (projectStage) project.projectStage = projectStage;
    if (chain) project.chain = chain;
    if (roles) project.roles = roles;
    if (links) project.links = links;
    if (coverImage) project.coverImage = coverImage;

    project = await project.save();
    await project.populate("owner", "username email avatar");

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

// Delete project (owner only) - soft delete
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    project.isActive = false;
    await project.save();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

// Like/Unlike project
export const toggleLike = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const likeIndex = project.likes.findIndex((id) => id.toString() === req.user._id.toString());

    if (likeIndex > -1) {
      // Unlike
      project.likes.splice(likeIndex, 1);
    } else {
      // Like
      project.likes.push(req.user._id);

      // Create notification (not for own project)
      if (project.owner.toString() !== req.user._id.toString()) {
        await Notification.create({
          to: project.owner,
          from: req.user._id,
          type: "like",
          project: project._id,
        });
      }
    }

    await project.save();
    res.json({ message: likeIndex > -1 ? "Unliked" : "Liked", likesCount: project.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};

// Save/Unsave project
export const toggleSave = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const saveIndex = project.saves.findIndex((id) => id.toString() === req.user._id.toString());

    if (saveIndex > -1) {
      project.saves.splice(saveIndex, 1);
    } else {
      project.saves.push(req.user._id);
    }

    await project.save();
    res.json({ message: saveIndex > -1 ? "Unsaved" : "Saved", savesCount: project.saves.length });
  } catch (error) {
    res.status(500).json({ message: "Error toggling save", error: error.message });
  }
};

// Get saved projects
export const getSavedProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ saves: req.user._id, isActive: true })
      .populate("owner", "username email avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments({ saves: req.user._id, isActive: true });

    res.json({
      projects,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved projects", error: error.message });
  }
};

// Get user's projects
export const getMyProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ owner: req.user._id, isActive: true })
      .populate("owner", "username email avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments({ owner: req.user._id, isActive: true });

    res.json({
      projects,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user projects", error: error.message });
  }
};

// Get trending projects
export const getTrendingProjects = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const projects = await Project.find({ isActive: true })
      .populate("owner", "username email avatar")
      .limit(parseInt(limit))
      .then(projects => {
        // Sort in memory by likes count
        return projects.sort((a, b) => b.likes.length - a.likes.length);
      });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trending projects", error: error.message });
  }
};
