import { Project } from "../models/projectModel.js";
import User from "../models/userModel.js";
import Request from "../models/requestModel.js";
import Notification from "../models/notificationModel.js";
import { emitNotificationUpdate } from "../utils/realtime.js";
import { autoFlagContent } from "../utils/contentFilter.js";

// Create project
export const createProject = async (req, res) => {
  try {
    const { title, description, category, techStack, tools, experienceLevel, projectStage, status, chain, roles, links, coverImage } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ message: "Add at least one role" });
    }

    const invalidRole = roles.find((role) => !role?.title?.trim() || !role?.description?.trim());
    if (invalidRole) {
      return res.status(400).json({ message: "Each role must include a title and description" });
    }

    const invalidLink = Array.isArray(links)
      ? links.find((link) => (link?.label && !link?.url) || (!link?.label && link?.url))
      : null;
    if (invalidLink) {
      return res.status(400).json({ message: "Each link needs both a label and a URL" });
    }

    // Auto-flag content
    const flagResult = autoFlagContent({ title, description, links });

    const project = await Project.create({
      owner: req.user._id,
      title,
      description,
      category,
      techStack: techStack || [],
      tools: tools || [],
      experienceLevel: experienceLevel || "",
      projectStage: projectStage || "",
      status: status || "Looking for collaborators",
      chain: chain || "",
      roles: roles || [],
      links: links || [],
      coverImage: coverImage || "",
      isFlagged: flagResult.shouldFlag,
      flagLevel: flagResult.flagLevel,
      flags: flagResult.shouldFlag ? flagResult.reasons.map(reason => ({ reason })) : [],
    });

    const populatedProject = await project.populate("owner", "username email avatar");

    // Include flag warning if content was flagged
    const response = {
      message: flagResult.shouldFlag 
        ? "Project created but flagged for moderation review"
        : "Project created successfully",
      project: populatedProject,
    };

    if (flagResult.shouldFlag) {
      response.flagWarning = {
        level: flagResult.flagLevel,
        reasons: flagResult.reasons,
      };
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating project:", error);

    if (error?.name === "ValidationError") {
      const validationMessage = Object.values(error.errors)
        .map((entry) => entry.message)
        .join(", ");

      return res.status(400).json({
        message: validationMessage || "Project validation failed",
        error: error.message,
      });
    }

    res.status(500).json({ message: error.message || "Error creating project", error: error.message });
  }
};

// Get all projects (feed with filters)
export const getProjects = async (req, res) => {
  try {
    const { category, search, status, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "roles.title": { $regex: search, $options: "i" } },
        { techStack: { $regex: search, $options: "i" } },
        { tools: { $regex: search, $options: "i" } },
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
      .populate("owner", "username email avatar bio roles skills links followers")
      .populate("collaborators", "username avatar roles");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is collaborator to show hidden links
    const isCollaborator = project.collaborators.some((c) => c._id.toString() === req.user._id.toString());
    const existingRequest = await Request.findOne({
      project: project._id,
      from: req.user._id,
    }).select("status");

    res.json({
      project,
      isCollaborator,
      requestStatus: existingRequest?.status || null,
    });
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

    const { title, description, category, techStack, tools, experienceLevel, projectStage, status, chain, roles, links, coverImage } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (techStack) project.techStack = techStack;
    if (tools) project.tools = tools;
    if (experienceLevel) project.experienceLevel = experienceLevel;
    if (projectStage) project.projectStage = projectStage;
    if (status) project.status = status;
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

// Get open project roles across the platform
export const getProjectRoles = async (req, res) => {
  try {
    const { q, category, experienceLevel, page = 1, limit = 30 } = req.query;
    const query = {
      isActive: true,
      roles: { $elemMatch: { status: "open" } },
    };

    if (category) query.category = category;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { "roles.title": { $regex: q, $options: "i" } },
        { "roles.description": { $regex: q, $options: "i" } },
        { techStack: { $regex: q, $options: "i" } },
        { tools: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const projects = await Project.find(query)
      .populate("owner", "username avatar roles")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const roles = projects.flatMap((project) =>
      project.roles
        .filter((role) => role.status === "open")
        .map((role) => ({
          _id: role._id,
          title: role.title,
          description: role.description,
          project: {
            _id: project._id,
            title: project.title,
            category: project.category,
            status: project.status,
            experienceLevel: project.experienceLevel,
            techStack: project.techStack,
            tools: project.tools,
            owner: project.owner,
          },
        }))
    );

    res.json({ roles, pagination: { page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching project roles", error: error.message });
  }
};

// Global search across projects, users, and roles
export const globalSearch = async (req, res) => {
  try {
    const { q = "", limit = 8 } = req.query;
    const term = q.trim();

    if (!term) {
      return res.json({ projects: [], users: [], roles: [] });
    }

    const regex = { $regex: term, $options: "i" };
    const [projects, users, roleProjects] = await Promise.all([
      Project.find({
        isActive: true,
        $or: [{ title: regex }, { description: regex }, { category: regex }, { techStack: regex }, { tools: regex }],
      })
        .populate("owner", "username avatar roles")
        .sort("-createdAt")
        .limit(parseInt(limit)),
      User.find({
        isActive: true,
        $or: [{ username: regex }, { fullName: regex }, { bio: regex }, { roles: regex }, { skills: regex }],
      })
        .select("username avatar fullName roles bio skills role")
        .limit(parseInt(limit)),
      Project.find({ isActive: true, roles: { $elemMatch: { status: "open", $or: [{ title: regex }, { description: regex }] } } })
        .populate("owner", "username avatar roles")
        .limit(parseInt(limit)),
    ]);

    const roles = roleProjects.flatMap((project) =>
      project.roles
        .filter((role) => role.status === "open" && `${role.title} ${role.description}`.toLowerCase().includes(term.toLowerCase()))
        .map((role) => ({ _id: role._id, title: role.title, description: role.description, project: { _id: project._id, title: project.title, category: project.category, owner: project.owner } }))
    ).slice(0, parseInt(limit));

    res.json({ projects, users, roles });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
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
    let liked = false;

    if (likeIndex > -1) {
      // Unlike
      project.likes.splice(likeIndex, 1);
      liked = false;
    } else {
      // Like
      project.likes.push(req.user._id);
      liked = true;

      // Create notification (not for own project)
      if (project.owner.toString() !== req.user._id.toString()) {
        await Notification.create({
          to: project.owner,
          from: req.user._id,
          type: "like",
          project: project._id,
        });

        emitNotificationUpdate(project.owner, { reason: "project_liked", projectId: project._id.toString() });
      }
    }

    await project.save();
    res.json({ 
      message: liked ? "Liked" : "Unliked", 
      liked,
      likesCount: project.likes.length 
    });
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
    let saved = false;

    if (saveIndex > -1) {
      project.saves.splice(saveIndex, 1);
      saved = false;
    } else {
      project.saves.push(req.user._id);
      saved = true;
    }

    await project.save();
    res.json({ 
      message: saved ? "Saved" : "Unsaved",
      saved,
      savesCount: project.saves.length 
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling save", error: error.message });
  }
};

// Get saved projects
export const getSavedProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (page - 1) * limit;
    const query = { saves: req.user._id, isActive: true };
    if (category) {
      query.category = category;
    }

    const projects = await Project.find(query)
      .populate("owner", "username email avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

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
