import express from "express";
import {
  signupStudent,
  signupCompany,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup/student", signupStudent);
router.post("/signup/company", signupCompany);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

export default router;