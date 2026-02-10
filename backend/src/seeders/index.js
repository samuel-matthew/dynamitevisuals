import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { seedAbout } from "./aboutSeeder.js";
import { seedAdmin } from "./userSeeder.js";
import { seedSettings } from "./settingSeeder.js";

dotenv.config();

try {
  await connectDB();

  await seedAdmin();
  await seedAbout();
  await seedSettings();

  console.log("All seeders completed");
  process.exit(0);
} catch (error) {
  console.error("Seeding error:", error);
  process.exit(1);
}
