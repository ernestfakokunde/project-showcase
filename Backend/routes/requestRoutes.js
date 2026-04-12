import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  sendRequest,
  getIncomingRequests,
  getSentRequests,
  acceptRequest,
  declineRequest,
  cancelRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/", protect, sendRequest);
router.get("/incoming", protect, getIncomingRequests);
router.get("/sent", protect, getSentRequests);
router.put("/:id/accept", protect, acceptRequest);
router.put("/:id/decline", protect, declineRequest);
router.delete("/:id", protect, cancelRequest);

export default router;
