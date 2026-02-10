import User from "../models/User.js";

export const seedAdmin = async () => {
  try {
    await User.deleteMany();

    await User.create({
      name: "Admin",
      email: "samuelmatthew071@gmail.com",
      password: "password123",
    });

    console.log("Admin user seeded");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
