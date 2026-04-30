import Request from "../models/requestModel.js";
import { Project } from "../models/projectModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import { emitNotificationUpdate, emitRequestUpdate } from "../utils/realtime.js";

// Send join request
export const sendRequest = async (req, res) => {
  try {
    const { projectId, pitch, whatYouOffer, email, phone, socials } = req.body;

    if (!projectId || !pitch) {
      return res.status(400).json({ message: "Project ID and pitch are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // User cannot request their own project
    if (project.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot request to join your own project" });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({ project: projectId, from: req.user._id });
    if (existingRequest) {
      return res.status(400).json({ message: "You have already requested to join this project" });
    }

    const request = await Request.create({
      project: projectId,
      from: req.user._id,
      owner: project.owner,
      pitch,
      whatYouOffer: whatYouOffer || "",
      email: email || req.user.email,
      phone: phone || "",
      socials: socials || {},
    });

    await request.populate("from", "username avatar roles email");
    await request.populate("project", "title");

    // Create notification
    await Notification.create({
      to: project.owner,
      from: req.user._id,
      type: "join_request",
      project: projectId,
      request: request._id,
    });

    emitNotificationUpdate(project.owner, { reason: "join_request", requestId: request._id.toString() });
    emitRequestUpdate(project.owner, { reason: "incoming_request", requestId: request._id.toString() });
    emitRequestUpdate(req.user._id, { reason: "sent_request", requestId: request._id.toString() });

    res.status(201).json({ message: "Request sent successfully", request });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: "You have already requested to join this project" });
    }

    res.status(500).json({ message: "Error sending request", error: error.message });
  }
};

// Get incoming requests (for project owner)
export const getIncomingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const requests = await Request.find({ owner: req.user._id })
      .populate("from", "username avatar roles bio links email")
      .populate("project", "title category")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Request.countDocuments({ owner: req.user._id });

    res.json({
      requests,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    res.status(500).json({ message: error.message || "Error fetching requests", error: error.message });
  }
};

// Get sent requests (requests made by user)
export const getSentRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const requests = await Request.find({ from: req.user._id })
      .populate("project", "title category owner")
      .populate("owner", "username avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Request.countDocuments({ from: req.user._id });

    res.json({
      requests,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({ message: error.message || "Error fetching sent requests", error: error.message });
  }
};

// Accept request
export const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("project");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only project owner can accept
    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // Add to collaborators
    const project = await Project.findById(request.project._id);
    if (!project.collaborators.includes(request.from)) {
      project.collaborators.push(request.from);
      await project.save();
    }

    request.status = "accepted";
    await request.save();

    // Create notification
    await Notification.create({
      to: request.from,
      from: req.user._id,
      type: "accepted",
      project: request.project._id,
      request: request._id,
    });

    emitNotificationUpdate(request.from, { reason: "request_accepted", requestId: request._id.toString() });
    emitRequestUpdate(request.from, { reason: "sent_request_updated", requestId: request._id.toString() });
    emitRequestUpdate(request.owner, { reason: "incoming_request_updated", requestId: request._id.toString() });

    res.json({ message: "Request accepted", request });
  } catch (error) {
    res.status(500).json({ message: "Error accepting request", error: error.message });
  }
};

// Decline request
export const declineRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only project owner can decline
    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to decline this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "declined";
    await request.save();

    // Create notification
    await Notification.create({
      to: request.from,
      from: req.user._id,
      type: "declined",
      project: request.project,
      request: request._id,
    });

    emitNotificationUpdate(request.from, { reason: "request_declined", requestId: request._id.toString() });
    emitRequestUpdate(request.from, { reason: "sent_request_updated", requestId: request._id.toString() });
    emitRequestUpdate(request.owner, { reason: "incoming_request_updated", requestId: request._id.toString() });

    res.json({ message: "Request declined", request });
  } catch (error) {
    res.status(500).json({ message: "Error declining request", error: error.message });
  }
};

// Cancel request (requester only)
export const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only request sender can cancel
    if (request.from.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this request" });
    }

    const ownerId = request.owner;

    await Request.findByIdAndDelete(req.params.id);

    emitRequestUpdate(req.user._id, { reason: "sent_request_cancelled", requestId: request._id.toString() });
    emitRequestUpdate(ownerId, { reason: "incoming_request_cancelled", requestId: request._id.toString() });

    res.json({ message: "Request cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling request", error: error.message });
  }
};
