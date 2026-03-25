import express from "express";
import {
  getMyStudentProfile,
  updateMyStudentProfile,
  uploadStudentPhoto,
  uploadStudentResume,
  getEligibleJobsForStudent,
  getMyApplications,
} from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All routes are student-only
router.use(protect, authorizeRoles("student"));

router.get("/me", getMyStudentProfile);
router.put("/me", updateMyStudentProfile);

router.put("/upload-photo", upload.single("photo"), uploadStudentPhoto);
router.put("/upload-resume", upload.single("resume"), uploadStudentResume);

router.get("/eligible-jobs", getEligibleJobsForStudent);
router.get("/my-applications", getMyApplications);

export default router;