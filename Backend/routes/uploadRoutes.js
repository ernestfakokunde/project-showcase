import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import protect from "../middleware/authMiddleware.js";
import { uploadRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();
const projectUploadDir = path.resolve("uploads", "projects");

fs.mkdirSync(projectUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectUploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);
  },
});

router.post(
  "/project-image",
  protect,
  uploadRateLimit(10, 60 * 60 * 1000),
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.status(201).json({
      message: "Image uploaded",
      url: `${baseUrl}/uploads/projects/${req.file.filename}`,
    });
  }
);

export default router;
