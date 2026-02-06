import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Video Editing", "Motion Graphics", "Animation", "Visual Effects", "Color Grading", "Other"],
    },
    description: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    tools: [String],
    thumbnail: {
      url: String,
      public_id: String,
    },
    video: {
      url: String,
      public_id: String,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
