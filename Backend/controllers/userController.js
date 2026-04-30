import User from "../models/userModel.js";
import { Project } from "../models/projectModel.js";
import Request from "../models/requestModel.js";
import Notification from "../models/notificationModel.js";
import { emitNotificationUpdate } from "../utils/realtime.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase() })
      .select("-password -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's projects
    const projects = await Project.find({ owner: user._id, isActive: true })
      .populate("owner", "username avatar")
      .sort("-createdAt");

    // Get user's collaborations
    const collaborations = await Project.find({ collaborators: user._id, isActive: true })
      .populate("owner", "username avatar")
      .sort("-createdAt");

    // Get user's liked projects
    const likedProjects = await Project.find({ likes: user._id, isActive: true })
      .populate("owner", "username avatar")
      .sort("-createdAt");

    res.json({
      user,
      projects,
      collaborations,
      likedProjects,
      stats: {
        projects: projects.length,
        collaborations: collaborations.length,
        followers: user.followers.length,
        following: user.following.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

// Update own profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatar, roles, skills, experienceLevel, links } = req.body;

    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (roles) user.roles = roles;
    if (skills) user.skills = skills;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (links) user.links = links;

    user = await user.save();
    user = user.toObject();
    delete user.password;

    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Toggle follow
export const toggleFollow = async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(req.user._id);

    const followIndex = currentUser.following.findIndex((id) => id.toString() === userId);
    let isFollowing = false;

    if (followIndex > -1) {
      // Unfollow
      currentUser.following.splice(followIndex, 1);
      userToFollow.followers.splice(
        userToFollow.followers.findIndex((id) => id.toString() === req.user._id.toString()),
        1
      );
      isFollowing = false;
    } else {
      // Follow
      currentUser.following.push(userId);
      userToFollow.followers.push(req.user._id);
      isFollowing = true;

      // Create notification
      await Notification.create({
        to: userId,
        from: req.user._id,
        type: "follow",
      });

      emitNotificationUpdate(userId, { reason: "new_follower", fromUserId: req.user._id.toString() });
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ 
      message: isFollowing ? "Followed" : "Unfollowed",
      isFollowing,
      user: userToFollow
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling follow", error: error.message });
  }
};

// Get suggested users (not yet followed)
export const getSuggestedUsers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const currentUser = await User.findById(req.user._id);

    const suggestedUsers = await User.find({
      _id: { $nin: [...currentUser.following, req.user._id] },
      isActive: true,
    })
      .select("username avatar fullName roles bio")
      .limit(parseInt(limit));

    res.json({ users: suggestedUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching suggested users", error: error.message });
  }
};

// Search users
export const searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } },
      ],
      isActive: true,
    })
      .select("username avatar fullName roles bio")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } },
      ],
      isActive: true,
    });

    res.json({
      users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error: error.message });
  }
};

// Get current user (me endpoint)
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get pending request count
    const pendingRequests = await Request.countDocuments({ owner: req.user._id, status: "pending" });

    // Get unread notification count
    const unreadNotifications = await Notification.countDocuments({ to: req.user._id, read: false });

    res.json({
      user,
      counts: {
        pendingRequests,
        unreadNotifications,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching current user", error: error.message });
  }
};
