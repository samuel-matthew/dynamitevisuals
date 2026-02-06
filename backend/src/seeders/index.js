import dotenv from "dotenv";
import connectDB from "../config/db.js";
import './userSeeder.js';
import './aboutSeeder.js';
import './settingSeeder.js';

dotenv.config();
await connectDB();
