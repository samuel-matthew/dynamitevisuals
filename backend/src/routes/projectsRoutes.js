import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/projectsController.js";
import uploadMedia from "../middlewares/uploadMedia.js";

const router = express.Router();

router.get("/", getProjects);

router.post(
  "/",
  uploadMedia.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createProject,
);


router.put(
  "/:id",
  uploadMedia.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateProject,
);

router.delete("/:id", deleteProject);

export default router;
