import About from "../models/About.js";


const seedAbout = async () => {
  await About.deleteMany();

  await About.create({
    title: "Video Editor & Motion Designer",
    bio: "Visual storyteller and video editor",
    tools: [
        { name: "Premiere Pro"},
        { name: "After Effects"}
    ],
    stats: [
      { label: "Years Experience", value: "8+" },
      { label: "Projects Completed", value: "200+" },
    ],
  });

  console.log("About seeded");
  process.exit();
};

seedAbout();
