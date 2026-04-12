import User from "../models/userModel.js";
import { Project } from "../models/projectModel.js";

// Get platform stats
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments({ isActive: true });
    const totalCollaborations = await Project.countDocuments({ collaborators: { $exists: true, $ne: [] } });
    const suspendedUsers = await User.countDocuments({ isActive: false });

    res.json({
      stats: {
        totalUsers,
        totalProjects,
        totalCollaborations,
        suspendedUsers,
        activeUsers: totalUsers - suspendedUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// Get all users (paginated, searchable)
export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Suspend/Unsuspend user
export const toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: user.isActive ? "User unsuspended" : "User suspended",
      user: { _id: user._id, username: user.username, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ message: "Error suspending user", error: error.message });
  }
};

// Delete user (hard delete)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete/soft-delete user's projects
    await Project.updateMany({ owner: req.params.id }, { isActive: false });

    res.json({ message: "User deleted", user: { _id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// Promote user to admin
export const promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already admin" });
    }

    user.role = "admin";
    await user.save();

    res.json({
      message: "User promoted to admin",
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error promoting user", error: error.message });
  }
};

// Get all projects (admin search/filter)
export const getAllProjects = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    let query = {};
    const skip = (page - 1) * limit;

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await Project.find(query)
      .populate("owner", "username email")
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

// Remove/soft-delete project (admin)
export const removeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isActive = false;
    await project.save();

    res.json({ message: "Project removed", project: { _id: project._id, title: project.title } });
  } catch (error) {
    res.status(500).json({ message: "Error removing project", error: error.message });
  }
};
