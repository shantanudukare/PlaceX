import express from "express";
import {
  getPendingStudents,
  getPendingCompanies,
  updateStudentApprovalStatus,
  updateCompanyApprovalStatus,
  getPendingJobs,
  updateJobApprovalStatus,
  getAllStudents,
  getAllCompanies,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes are admin-only
router.use(protect, authorizeRoles("admin"));

router.get("/pending-students", getPendingStudents);
router.get("/pending-companies", getPendingCompanies);
router.get("/pending-jobs", getPendingJobs);

router.put("/student/:id/status", updateStudentApprovalStatus);
router.put("/company/:id/status", updateCompanyApprovalStatus);
router.put("/job/:id/status", updateJobApprovalStatus);

router.get("/students", getAllStudents);
router.get("/companies", getAllCompanies);

export default router;