import express from 'express'
import { aboutme, deleteAboutItem, updateAbout } from '../controllers/aboutController.js';
import uploadImage from '../middlewares/uploadImage.js';

const router = express.Router();

router.get("/", aboutme)
router.put("/", uploadImage.single("profileImage"), updateAbout);
router.delete("/item/:type/:id", deleteAboutItem)

export default router