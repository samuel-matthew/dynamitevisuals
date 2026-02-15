import About from "../models/About.js";

export const seedAbout = async () => {
  await About.deleteMany();

  await About.create({
    title: "Video Editor & Motion Designer",

    bio: "Turning Vision Into Reality",

    philosophy: "For over 8 years, I've been helping brands, agencies, and creators tell their stories through compelling visual content. My approach combines technical excellence with creative intuition. I believe great editing is invisible—it guides emotion, builds tension, and delivers impact without the viewer ever noticing the cuts. From fast-paced commercials to cinematic documentaries, I adapt my style to serve your story. Whether you're launching a product, sharing a message, or creating content for social media, I bring your vision to life with precision and creativity.",

    tools: [{ name: "Premiere Pro" }, { name: "After Effects" }],
    stats: [
      { label: "Years Experience", value: "8+" },
      { label: "Projects Completed", value: "20+" },
      { label: "Happy Clients", value: "20+" },
    ],
  });

  console.log("About seeded");
};
