import Settings from "../models/Settings.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { email, phone, whatsapp, socials } = req.body;
    
    // Find existing settings to check if we need to delete old showreel
    const existingSettings = await Settings.findOne({});

    let showreel = existingSettings?.showreel || null;

    // Handle showreel upload
    if (req.files?.showreel?.[0]) {
      // Delete old showreel if exists
      if (existingSettings?.showreel?.public_id) {
        await cloudinary.uploader.destroy(existingSettings.showreel.public_id, {
          resource_type: "video",
        });
      }

      const file = req.files.showreel[0];
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "dynamite-visuals/showreel",
        resource_type: "video",
      });

      showreel = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // Parse socials if it's a string (FormData sends it as JSON string)
    const parsedSocials = typeof socials === 'string' ? JSON.parse(socials) : socials;

    const settings = await Settings.findOneAndUpdate({},
      {
        email,
        phone,
        whatsapp,
        socials: parsedSocials,
        showreel,
      },
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({message: 'Error updating settings' });
  }
};


export const deleteSettingItem = async (req, res) => {
  try {
    const { type, id } = req.params;

    // whitelist allowed arrays
    if (!["socials"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const setting = await Settings.findOneAndUpdate(
      {},
      {
        $pull: {
          [type]: { _id: new mongoose.Types.ObjectId(id) },
        },
      },
      { new: true },
    );

    if (!setting) return res.json({ message: "About not found" });

    res.status(200).json(setting);

    

  } catch (error) {
    res.status(500).json({message: 'Error deleting item from settings' });
  }
};