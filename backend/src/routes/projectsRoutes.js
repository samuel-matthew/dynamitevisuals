import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/projectsController.js";
import uploadMedia from "../middlewares/uploadMedia.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getProjects);

router.post(
  "/",
  verifyToken, checkRole("admin"),
  uploadMedia.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createProject,
);

router.put(
  "/:id",
  verifyToken, checkRole("admin"),
  uploadMedia.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateProject,
);

router.delete("/:id", verifyToken, checkRole("admin"), deleteProject);

export default router;
