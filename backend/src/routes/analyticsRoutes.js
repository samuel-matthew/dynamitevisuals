import express from "express";
import { recordView, getAnalyticsStats } from "../controllers/analyticsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route to record views
router.post("/", recordView);

// Protected route to get stats
router.get("/stats", verifyToken, getAnalyticsStats);

export default router;
