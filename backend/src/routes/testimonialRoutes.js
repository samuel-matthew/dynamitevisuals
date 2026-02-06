import express from 'express';
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from '../controllers/testimonialController.js';
import uploadImage from '../middlewares/uploadImage.js';

const router = express.Router();

router.get("/", getTestimonials);

router.post("/", uploadImage.single("avatar"), createTestimonial);

router.put("/:id", uploadImage.single("avatar"), updateTestimonial);

router.delete("/:id", deleteTestimonial);

export default router;