import User from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import Job from "../models/Job.model.js";
import Application from "../models/Application.model.js";
import { APPROVAL_STATUS } from "../utils/constants.js";

export const checkStudentEligibilityForJob = async ({
  studentUserId,
  jobId,
  preventMultipleOffers = true,
}) => {
  const user = await User.findById(studentUserId);
  const studentProfile = await StudentProfile.findOne({ user: studentUserId });
  const job = await Job.findById(jobId);

  if (!user || !studentProfile || !job) {
    return {
      isEligible: false,
      reason: "Student profile or job not found",
    };
  }

  // 1. Student must be approved
  if (user.approvalStatus !== APPROVAL_STATUS.APPROVED) {
    return {
      isEligible: false,
      reason: "Student profile is not approved by admin",
    };
  }

  // 2. Job must be approved and active
  if (job.approvalStatus !== APPROVAL_STATUS.APPROVED || !job.isActive) {
    return {
      isEligible: false,
      reason: "Job is not available for application",
    };
  }

  // 3. Deadline must not be passed
  if (new Date(job.deadline) < new Date()) {
    return {
      isEligible: false,
      reason: "Application deadline has passed",
    };
  }

  // 4. CGPA must be enough
  if (studentProfile.cgpa < job.minCgpa) {
    return {
      isEligible: false,
      reason: `Minimum CGPA required is ${job.minCgpa}`,
    };
  }

  // 5. Branch must be allowed
// 5. Branch eligibility check

const allowedBranches =
  job.allowedBranches?.map((b) =>
    b.trim().toLowerCase()
  ) || []

const studentBranch =
  studentProfile.branch?.trim().toLowerCase()

// If "all" exists, every branch is eligible
const allBranchesAllowed =
  allowedBranches.includes("all")

// Otherwise check specific branch
if (
  !allBranchesAllowed &&
  !allowedBranches.includes(studentBranch)
) {
  return {
    isEligible: false,
    reason: `Your branch (${studentProfile.branch}) is not eligible for this job`,
  };
}

  // 6. Already applied check
  const existingApplication = await Application.findOne({
    student: studentUserId,
    job: jobId,
  });

  if (existingApplication) {
    return {
      isEligible: false,
      reason: "You have already applied to this job",
    };
  }

  // 7. Optional placement restriction
  if (preventMultipleOffers && studentProfile.isPlaced) {
    return {
      isEligible: false,
      reason: "You have already been selected for another job",
    };
  }

  return {
    isEligible: true,
    reason: "Eligible to apply",
    studentProfile,
    job,
  };
};