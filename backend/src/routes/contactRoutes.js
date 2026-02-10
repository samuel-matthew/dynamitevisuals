import express from "express";
import { sendEmail, getContactStats, getContacts } from "../controllers/contactController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route for sending contact emails
router.post("/", sendEmail);

// Protected routes for admin
router.get("/stats", verifyToken, getContactStats);
router.get("/", verifyToken, getContacts);

export default router;
