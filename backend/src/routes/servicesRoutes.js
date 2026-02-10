import express from "express";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../controllers/servicesController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", verifyToken, checkRole("admin"), createService);
router.put("/:id", verifyToken, checkRole("admin"), updateService);
router.delete("/:id", verifyToken, checkRole("admin"), deleteService);

export default router;
