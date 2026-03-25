import express from "express";
import {
  applyToJob,
  updateApplicationStatus,
  getStudentApplications,
  getCompanyApplications,
} from "../controllers/application.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Student routes
router.post("/:jobId", protect, authorizeRoles("student"), applyToJob);
router.get("/student", protect, authorizeRoles("student"), getStudentApplications);

// Company routes
router.put(
  "/:applicationId/status",
  protect,
  authorizeRoles("company"),
  updateApplicationStatus
);
router.get("/company", protect, authorizeRoles("company"), getCompanyApplications);

export default router;