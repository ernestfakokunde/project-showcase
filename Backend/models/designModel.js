import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ["UI Design", "Web Design", "App Design", "Branding", "Illustration", "Motion", "3D", "Other"],
    default: "UI Design"
  },
  images: [
    {
      url: { type: String, required: true },
      caption: { type: String, default: "" }
    }
  ],
  tools: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  links: [
    {
      url: { type: String, required: true },
      label: { type: String, default: "" }
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  rejectionReason: {
    type: String,
    default: null
  },
  // Auto-flagging system
  flags: {
    type: [{
      reason: String,
      flaggedAt: { type: Date, default: Date.now },
    }],
    default: [],
  },
  flagLevel: {
    type: String,
    enum: ["low", "medium", "high", "none"],
    default: "none",
  },
  isFlagged: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Design", designSchema);
