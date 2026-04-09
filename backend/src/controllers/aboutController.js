import About from "../models/About.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

export const aboutme = async (req, res) => {
  try {
    const about = await About.findOne();
    const user = await User.findOne();

    const aboutData = about ? about.toObject() : {};

    res.status(200).json({
      name: user?.name,
      ...aboutData,
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to retrieve about information` });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const { name, ...aboutBody } = req.body;
    let aboutData = { ...aboutBody };

    // Parse JSON strings if they come from FormData
    if (typeof aboutData.stats === "string") {
      try {
        aboutData.stats = JSON.parse(aboutData.stats);
      } catch (e) {
        // Invalid stats JSON, skip parsing
      }
    }
    if (typeof aboutData.tools === "string") {
      try {
        aboutData.tools = JSON.parse(aboutData.tools);
      } catch (e) {
        // Invalid tools JSON, skip parsing
      }
    }

    // update user name if provided
    if (name) {
      await User.findOneAndUpdate({}, { name });
    }

    // get existing about doc first
    const existingAbout = await About.findOne({});

    // if new image uploaded
    if (req.file) {
      // delete previous image if it exists
      if (existingAbout?.profileImage?.public_id) {
        await cloudinary.uploader.destroy(existingAbout.profileImage.public_id);
      }

      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "dynamite-visuals/profile",
        resource_type: "image",
      });

      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Cloudinary upload failed - no URL returned");
      }

      aboutData.profileImage = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    } else {
      // If no new file, don't modify existing profileImage
      delete aboutData.profileImage;
    }

    const about = await About.findOneAndUpdate({}, aboutData, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    // Re-fetch user to get updated name if any
    const user = await User.findOne({});

    res.status(200).json({
      name: user?.name,
      ...about.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating about information" });
  }
};

export const deleteAboutItem = async (req, res) => {
  try {
    const { type, id } = req.params;

    // whitelist allowed arrays
    if (!["stats", "tools"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const about = await About.findOneAndUpdate(
      {},
      {
        $pull: {
          [type]: { _id: new mongoose.Types.ObjectId(id) },
        },
      },
      { new: true },
    );

    if (!about) return res.json({ message: "About not found" });

    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
