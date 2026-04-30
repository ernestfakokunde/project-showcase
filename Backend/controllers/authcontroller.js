import User from "../models/userModel.js";
import generateToken from "../utils/genToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"

//Register a new user
//Route : Post /api/auth/register

export const registerUser = async (req,res)=>{
   
  try {
     const { username, name, email, password, roles = [] } = req.body;
     const userNameValue = (username || name || "").trim().toLowerCase()
  //validate input and fields
  if(!userNameValue || !email || !password){
    return res.status(400).json({message: "Please fill all fields"})
  }
  //check if user exists
  const userExists = await User.findOne({
    $or: [{ email: email.trim().toLowerCase() }, { username: userNameValue }],
  })
  if(userExists){
    const field = userExists.email === email.trim().toLowerCase() ? "Email" : "Username"
    return res.status(400).json({message: `${field} already exists`})
  }
  //create user
  const user = await User.create({
    username: userNameValue,
    email: email.trim().toLowerCase(),
    password,
    roles,
  })

  return res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role)
  })

  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((err) => err.message).join(", ")
      return res.status(400).json({ message })
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "User"
      return res.status(400).json({ message: `${field} already exists` })
    }

    return res.status(500).json({message: "Error creating user", error: error.message})
  }
}

export const login = async (req, res) => {      
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been suspended" })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase()

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    //generate reset token 
    const resetToken = crypto.randomBytes(20).toString("hex")
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    await user.save({ validateBeforeSave: false })

    const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173"
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`

    await sendEmail({
      to: user.email,
      subject: "StackLab — Password Reset Request",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#7f77dd;">Reset your password</h2>
          <p>You requested a password reset for your StackLab account.</p>
          <p>Click the button below — this link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:20px 0;background:#7f77dd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;">
            Reset password
          </a>
          <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    })

    res.json({ message: "Reset link sent to your email" })

  } catch (error) {
    return res.status(500).json({ message: "Error sending email", error: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.json({ message: "Password reset successful, please login" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
