import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.model.js";
import { ROLES, APPROVAL_STATUS } from "./constants.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: "admin@college.com" });

    if (existingAdmin) {
      console.log("⚠ Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      fullName: "College Admin",
      email: "admin@college.com",
      password: "123456",
      role: ROLES.ADMIN,
      approvalStatus: APPROVAL_STATUS.APPROVED,
    });

    console.log("✅ Admin created successfully");
    console.log({
      email: admin.email,
      password: "123456",
    });

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();