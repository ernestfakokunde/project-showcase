import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoute.js";
import projectRoutes from "./routes/projectRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoute.js";
import designRoutes from "./routes/designRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { connectDB } from "./config/db.js";
import User from "./models/userModel.js";
import { getUserRoom, setSocketServer } from "./utils/realtime.js";
import { rateLimit, strictRateLimit } from "./middleware/rateLimit.js";


//load my env vars
dotenv.config()
connectDB()

const app = express()
const server = http.createServer(app);

// ========== SECURITY CONFIGURATION ==========
// CORS with strict security settings
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Rate limiting on all requests
app.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// Security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  // Prevent MIME sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Enable XSS filter
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // CSP header
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  // Disable browser caching for sensitive routes
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ========== ROUTES ==========
// Apply strict rate limiting to sensitive routes
app.use("/api/users/register", strictRateLimit(5, 15 * 60 * 1000)); // 5 per 15 min
app.use("/api/users/login", strictRateLimit(10, 15 * 60 * 1000)); // 10 per 15 min
app.use("/api/users/forgot-password", strictRateLimit(3, 60 * 60 * 1000)); // 3 per hour

app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/designs", designRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/uploads", uploadRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/messages", messageRoutes)

//Health check 
app.get("/", (req, res) => {
  res.send(" Stacklab API is running")
  console.log("Health check endpoint hit. StackLab Api is running")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Not authorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.userId = user._id.toString();
    next();
  } catch (error) {
    next(new Error("Not authorized"));
  }
});

io.on("connection", (socket) => {
  socket.join(getUserRoom(socket.userId));
  socket.emit("socket:ready", { userId: socket.userId });
});

setSocketServer(io);

const PORT = process.env.PORT || 8000
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the existing server or change PORT in Backend/.env.`);
    process.exit(1);
  }

  console.error("Server failed to start:", error);
  process.exit(1);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
