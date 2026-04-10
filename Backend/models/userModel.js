import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Profile
    fullName: { type: String, trim: true },
    bio: { type: String, maxlength: 300 },
    avatar: { type: String, default: "" },
    roles: {
      type: [String],
      enum: ["Developer", "Designer", "Web3", "AI/ML", "Game Dev", "Motion", "Other"],
      default: [],
    },
    skills: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ["Junior", "Mid", "Senior", ""],
      default: "",
    },
    links: {
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },

    // Social
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Forgot password
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

//hash password before saving

userSchema.pre("save", async function (){
  if(!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model("User", userSchema)