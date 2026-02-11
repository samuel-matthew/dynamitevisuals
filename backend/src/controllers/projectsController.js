import Projects from "../models/Projects.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

export const getProjects = async (req, res) => {
  try {
    const projects = await Projects.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving projects' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, category, description, role, tools, featured } = req.body;

    let thumbnail = null;
    let video = null;

    // upload thumbnail
    if (req.files?.thumbnail?.[0]) {
      const file = req.files.thumbnail[0];

      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "dynamite-visuals/projects/thumbnails",
        resource_type: "image",
      });

      thumbnail = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // upload video
    if (req.files?.video?.[0]) {
      const file = req.files.video[0];

      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "dynamite-visuals/projects/videos",
        resource_type: "video",
      });

      video = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // tools may come as string from form-data
    const parsedTools =
      typeof tools === "string" ? tools.split(",").map((t) => t.trim()) : tools;

    const project = await Projects.create({
      title,
      category,
      description,
      role,
      tools: parsedTools,
      thumbnail,
      video,
      featured,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Projects.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { title, category, description, role, tools, featured } = req.body;

    //  update simple fields if provided
    if (title) project.title = title;
    if (category) project.category = category;
    if (description) project.description = description;
    if (role) project.role = role;
    if (featured !== undefined) project.featured = featured;

    if (tools) {
      project.tools =
        typeof tools === "string"
          ? tools.split(",").map((t) => t.trim())
          : tools;
    }

    // Replace Thumbnail
    if (req.files?.thumbnail?.[0]) {
      // delete old image
      if (project.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(project.thumbnail.public_id, {
          resource_type: "image",
        });
      }

      const file = req.files.thumbnail[0];
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "dynamite-visuals/projects/thumbnails",
        resource_type: "image",
      });

      project.thumbnail = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // Replace Video
    if (req.files?.video?.[0]) {
      // delete old video
      if (project.video?.public_id) {
        await cloudinary.uploader.destroy(project.video.public_id, {
          resource_type: "video",
        });
      }

      const file = req.files.video[0];
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "dynamite-visuals/projects/videos",
        resource_type: "video",
      });

      project.video = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project' });
  }
};



export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Projects.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete thumbnail
    if (project.thumbnail?.public_id) {
      try {
        await cloudinary.uploader.destroy(project.thumbnail.public_id, {
          resource_type: "image",
        });
      } catch (err) {
        console.error("Thumbnail delete failed:", err.message);
      }
    }

    // Delete video
    if (project.video?.public_id) {
      try {
        await cloudinary.uploader.destroy(project.video.public_id, {
          resource_type: "video",
        });
      } catch (err) {
        console.error("Video delete failed:", err.message);
      }
    }

    // DB delete
    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};
