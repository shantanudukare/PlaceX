import express from "express";
import {
  getMyCompanyProfile,
  updateMyCompanyProfile,
  uploadCompanyLogo,
  getMyCompanyJobs,
  getApplicantsForMyJob,
} from "../controllers/company.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All routes are company-only
router.use(protect, authorizeRoles("company"));

router.get("/me", getMyCompanyProfile);
router.put("/me", updateMyCompanyProfile);

router.put("/upload-logo", upload.single("logo"), uploadCompanyLogo);

router.get("/my-jobs", getMyCompanyJobs);
router.get("/job/:jobId/applicants", getApplicantsForMyJob);

export default router;