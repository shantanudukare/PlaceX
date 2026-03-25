import express from "express";
import {
  getAdminDashboardStats,
  getCompanyDashboardStats,
  getStudentDashboardStats,
} from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/admin", protect, authorizeRoles("admin"), getAdminDashboardStats);
router.get("/company", protect, authorizeRoles("company"), getCompanyDashboardStats);
router.get("/student", protect, authorizeRoles("student"), getStudentDashboardStats);

export default router;