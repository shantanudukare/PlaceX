import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import User from "../models/User.model.js";
import Job from "../models/Job.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import CompanyProfile from "../models/CompanyProfile.model.js";
import { APPROVAL_STATUS, ROLES } from "../utils/constants.js";
import { createNotification } from "../services/notification.service.js";

/**
 * @desc    Get all pending students
 * @route   GET /api/admin/pending-students
 * @access  Private (Admin)
 */
export const getPendingStudents = asyncHandler(async (req, res) => {
  const students = await User.find({
    role: ROLES.STUDENT,
    approvalStatus: APPROVAL_STATUS.PENDING,
  }).sort({ createdAt: -1 });

  successResponse(res, "Pending students fetched successfully", students);
});

/**
 * @desc    Get all pending companies
 * @route   GET /api/admin/pending-companies
 * @access  Private (Admin)
 */
export const getPendingCompanies = asyncHandler(async (req, res) => {
  const companies = await User.find({
    role: ROLES.COMPANY,
    approvalStatus: APPROVAL_STATUS.PENDING,
  }).sort({ createdAt: -1 });

  successResponse(res, "Pending companies fetched successfully", companies);
});

/**
 * @desc    Approve or reject student
 * @route   PUT /api/admin/student/:id/status
 * @access  Private (Admin)
 */
export const updateStudentApprovalStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approvalStatus } = req.body;

  if (
    ![APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.REJECTED].includes(
      approvalStatus
    )
  ) {
    res.status(400);
    throw new Error("Invalid approval status");
  }

  const student = await User.findOne({
    _id: id,
    role: ROLES.STUDENT,
  });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  student.approvalStatus = approvalStatus;
  await student.save();

  await createNotification({
    recipient: student._id,
    title: "Profile Approval Update",
    message: `Your student profile has been ${approvalStatus.toLowerCase()} by admin`,
    type: "PROFILE_APPROVAL",
  });

  successResponse(
    res,
    `Student ${approvalStatus.toLowerCase()} successfully`,
    student
  );
});

/**
 * @desc    Approve or reject company
 * @route   PUT /api/admin/company/:id/status
 * @access  Private (Admin)
 */
export const updateCompanyApprovalStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approvalStatus } = req.body;

  if (
    ![APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.REJECTED].includes(
      approvalStatus
    )
  ) {
    res.status(400);
    throw new Error("Invalid approval status");
  }

  const company = await User.findOne({
    _id: id,
    role: ROLES.COMPANY,
  });

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  company.approvalStatus = approvalStatus;
  await company.save();

  await createNotification({
    recipient: company._id,
    title: "Company Approval Update",
    message: `Your company account has been ${approvalStatus.toLowerCase()} by admin`,
    type: "PROFILE_APPROVAL",
  });

  successResponse(
    res,
    `Company ${approvalStatus.toLowerCase()} successfully`,
    company
  );
});

/**
 * @desc    Get all pending jobs
 * @route   GET /api/admin/pending-jobs
 * @access  Private (Admin)
 */
export const getPendingJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({
    approvalStatus: APPROVAL_STATUS.PENDING,
  })
    .populate("company", "fullName email")
    .populate("companyProfile", "companyName logo")
    .sort({ createdAt: -1 });

  successResponse(res, "Pending jobs fetched successfully", jobs);
});

/**
 * @desc    Approve or reject job
 * @route   PUT /api/admin/job/:id/status
 * @access  Private (Admin)
 */
export const updateJobApprovalStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approvalStatus } = req.body;

  if (
    ![APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.REJECTED].includes(
      approvalStatus
    )
  ) {
    res.status(400);
    throw new Error("Invalid approval status");
  }

  const job = await Job.findById(id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  job.approvalStatus = approvalStatus;
  await job.save();

  await createNotification({
    recipient: job.company,
    title: "Job Approval Update",
    message: `Your job posting "${job.role}" has been ${approvalStatus.toLowerCase()} by admin`,
    type: "JOB",
    relatedJob: job._id,
  });

  successResponse(res, `Job ${approvalStatus.toLowerCase()} successfully`, job);
});

/**
 * @desc    Get all students
 * @route   GET /api/admin/students
 * @access  Private (Admin)
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await StudentProfile.find()
    .populate("user", "fullName email approvalStatus createdAt")
    .sort({ createdAt: -1 });

  successResponse(res, "All students fetched successfully", students);
});

/**
 * @desc    Get all companies
 * @route   GET /api/admin/companies
 * @access  Private (Admin)
 */
export const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await CompanyProfile.find()
    .populate("user", "fullName email approvalStatus createdAt")
    .sort({ createdAt: -1 });

  successResponse(res, "All companies fetched successfully", companies);
});