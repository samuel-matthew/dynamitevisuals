import express from 'express'
import { aboutme, deleteAboutItem, updateAbout } from '../controllers/aboutController.js';
import uploadImage from '../middlewares/uploadImage.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get("/", aboutme)
router.put("/", verifyToken, checkRole("admin"), uploadImage.single("profileImage"), updateAbout);
router.delete("/item/:type/:id", verifyToken, checkRole("admin"), deleteAboutItem)

export default router