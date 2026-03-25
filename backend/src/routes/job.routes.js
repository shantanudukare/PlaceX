import express from "express";
import {
  createJob,
  getAllApprovedJobs,
  getJobById,
  updateMyJob,
  deleteMyJob,
} from "../controllers/job.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllApprovedJobs);
router.get("/:id", getJobById);

// Company-only routes
router.post("/", protect, authorizeRoles("company"), createJob);
router.put("/:id", protect, authorizeRoles("company"), updateMyJob);
router.delete("/:id", protect, authorizeRoles("company"), deleteMyJob);

export default router;