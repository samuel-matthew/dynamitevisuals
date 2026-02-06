import Testimonial from "../models/Testimonial.js";
import cloudinary from "../config/cloudinary.js";

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, content, rating } = req.body;

    let avatarData = null;

    if (req.file) {
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "dynamite-visuals/avatar",
        resource_type: "image",
      });

      avatarData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    const newTestimonial = await Testimonial.create({
      name,
      role,
      content,
      rating,
      avatar: avatarData,
    });

    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, content, rating } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const updateData = { name, role, content, rating };

    if (req.file) {
      // delete old avatar if exists
      if (testimonial.avatar?.public_id) {
        await cloudinary.uploader.destroy(testimonial.avatar.public_id);
      }

      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "dynamite-visuals/avatar",
        resource_type: "image",
      });

      updateData.avatar = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    const updated = await Testimonial.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    if (testimonial.avatar?.public_id) {
      await cloudinary.uploader.destroy(testimonial.avatar.public_id);
    }

    await testimonial.deleteOne();

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

