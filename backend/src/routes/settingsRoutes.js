import express from "express";
import {
  deleteSettingItem,
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import uploadMedia from "../middlewares/uploadMedia.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getSettings);
router.put(
  "/",
  verifyToken,
  checkRole("admin"),
  uploadMedia.fields([{ name: "showreel", maxCount: 1 }]),
  updateSettings,
);
router.delete("/item/:type/:id", verifyToken, checkRole("admin"), deleteSettingItem);

export default router;
