import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status:{
    type: String,
    enum: ["open", "closed"],
    default: ""
  }
})

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, default: "" }
}, { _id: false })

const projectSchema = new mongoose.Schema({
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true, trim: true , maxlength: 2000},
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Dev",
      "Design",
      "Web3",
      "AI/ML",
      "Game Dev",
      "Motion",
      "Open Source",
      "Other",
    ],
  },
  coverImage: {
    type: String,
    default: "",
  },
  // Dynamic fields — filled based on category
  techStack: {
    type: [String],
    default: [],
  },
  tools: {
    type: [String],
    default: [],
  },
  experienceLevel: {
    type: String,
    enum: ["Junior", "Mid", "Senior", "Any", ""],
    default: "",
  },
  projectStage: {
    type: String,
    enum: [
      "Concept",
      "Just started",
      "In progress",
      "MVP done",
      "",
    ],
    default: "",
  },
  status: {
    type: String,
    enum: ["Idea", "Building", "Looking for collaborators", "Paused", "Launched"],
    default: "Looking for collaborators",
  },
  // Web3 specific
  chain: {
    type: String,
    default: "",
  },
  // Roles needed
  roles: {
    type: [roleSchema],
    default: [],
  },
  // Community links — hidden until accepted
  links: {
    type: [linkSchema],
    default: [],
  },
  // People who joined
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // Likes — array of user IDs
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // Saves — array of user IDs
  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // Soft delete
  isActive: {
    type: Boolean,
    default: true,
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })


// Virtual — total likes count
projectSchema.virtual("likesCount").get(function () {
  return this.likes.length
})

// Virtual — open spots left
projectSchema.virtual("spotsLeft").get(function () {
  return this.roles.filter((r) => r.status === "open").length
})

export const Project = mongoose.model("Project", projectSchema)
