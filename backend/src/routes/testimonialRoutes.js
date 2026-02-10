import express from 'express';
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from '../controllers/testimonialController.js';
import uploadImage from '../middlewares/uploadImage.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get("/", getTestimonials);

router.post("/", verifyToken, checkRole("admin"), uploadImage.single("avatar"), createTestimonial);

router.put("/:id", verifyToken, checkRole("admin"), uploadImage.single("avatar"), updateTestimonial);

router.delete("/:id", verifyToken, checkRole("admin"), deleteTestimonial);

export default router;