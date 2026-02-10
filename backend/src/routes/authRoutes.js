import express from "express";
// import router from './testimonialRoutes.js';
import {
  login,
  logout,
  verify,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/verify", verifyToken, verify);
router.post("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
