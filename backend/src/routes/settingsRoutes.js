import express from "express";
import { deleteSettingItem, getSettings, updateSettings } from "../controllers/settingsController.js";
import uploadMedia from "../middlewares/uploadMedia.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", uploadMedia.fields([{ name: 'showreel', maxCount: 1 }]), updateSettings);
router.delete("/item/:type/:id", deleteSettingItem)


export default router