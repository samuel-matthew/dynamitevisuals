import Settings from "../models/Settings.js";

export const seedSettings = async () => {
  await Settings.deleteMany();

  await Settings.create({
    email: "dynamitevisuals1@gmail.com",
    phone: "+234 703 105 5642",
    whatsapp: "+234 703 105 5642",
    socials: [
      { label: "Facebook", value: "https://facebook.com/dynamitevisuals" },
      { label: "Instagram", value: "https://instagram.com/dynamitevisuals" },
      { label: "youtube", value: "https://youtube.com/@dynamitevisuals" },
    ],
  });

  console.log("Settings seeded");
};
