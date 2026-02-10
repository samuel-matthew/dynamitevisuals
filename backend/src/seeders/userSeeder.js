import User from "../models/User.js";


const seedAdmin = async () => {
  try {
    await User.deleteMany();

    await User.create({
      name: "Admin",
      email: "samuelmatthew071@gmail.com",
      password: "password123"
    });

    console.log("Admin user seeded");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
