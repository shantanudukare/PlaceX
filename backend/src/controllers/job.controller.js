import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import Job from "../models/Job.model.js";
import CompanyProfile from "../models/CompanyProfile.model.js";
import User from "../models/User.model.js";
import { APPROVAL_STATUS } from "../utils/constants.js";
import { createBulkNotifications } from "../services/notification.service.js";

/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 * @access  Private (Company)
 */
export const createJob = asyncHandler(async (req, res) => {
  const {
    role,
    description,
    ctc,
    location,
    mode,
    minCgpa,
    allowedBranches,
    skillsRequired,
    deadline,
    openings,
  } = req.body;

  if (
    !role ||
    !description ||
    ctc === undefined ||
    !location ||
    minCgpa === undefined ||
    !allowedBranches ||
    !deadline
  ) {
    res.status(400);
    throw new Error("Please provide all required job fields");
  }

  const companyProfile = await CompanyProfile.findOne({ user: req.user._id });

  if (!companyProfile) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const job = await Job.create({
    company: req.user._id,
    companyProfile: companyProfile._id,
    role,
    description,
    ctc,
    location,
    mode,
    minCgpa,
    allowedBranches: Array.isArray(allowedBranches)
      ? allowedBranches
      : allowedBranches.split(",").map((b) => b.trim()),
    skillsRequired: Array.isArray(skillsRequired)
      ? skillsRequired
      : skillsRequired
      ? skillsRequired.split(",").map((s) => s.trim())
      : [],
    deadline,
    openings,
    approvalStatus: APPROVAL_STATUS.PENDING,
  });

  successResponse(
    res,
    "Job created successfully and sent for admin approval",
    job,
    201
  );
});

/**
 * @desc    Get all approved jobs (with filters)
 * @route   GET /api/jobs
 * @access  Public / Private
 */
export const getAllApprovedJobs = asyncHandler(async (req, res) => {
  const { role, company, minCtc, maxCtc, mode } = req.query;

  const query = {
    approvalStatus: APPROVAL_STATUS.APPROVED,
    isActive: true,
    deadline: { $gte: new Date() },
  };

  if (role) {
    query.role = { $regex: role, $options: "i" };
  }

  if (mode) {
    query.mode = mode;
  }

  if (minCtc || maxCtc) {
    query.ctc = {};
    if (minCtc) query.ctc.$gte = Number(minCtc);
    if (maxCtc) query.ctc.$lte = Number(maxCtc);
  }

  let jobs = await Job.find(query)
    .populate("company", "fullName email")
    .populate("companyProfile", "companyName logo location")
    .sort({ createdAt: -1 });

  // Filter by company name manually after populate
  if (company) {
    jobs = jobs.filter((job) =>
      job.companyProfile?.companyName
        ?.toLowerCase()
        .includes(company.toLowerCase())
    );
  }

  successResponse(res, "Approved jobs fetched successfully", jobs);
});

/**
 * @desc    Get job by ID
 * @route   GET /api/jobs/:id
 * @access  Public / Private
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("company", "fullName email")
    .populate("companyProfile", "companyName logo location description website");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  successResponse(res, "Job fetched successfully", job);
});

/**
 * @desc    Update own company job
 * @route   PUT /api/jobs/:id
 * @access  Private (Company)
 */
export const updateMyJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    company: req.user._id,
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found or unauthorized access");
  }

  const {
    role,
    description,
    ctc,
    location,
    mode,
    minCgpa,
    allowedBranches,
    skillsRequired,
    deadline,
    openings,
    isActive,
  } = req.body;

  if (role) job.role = role;
  if (description) job.description = description;
  if (ctc !== undefined) job.ctc = ctc;
  if (location) job.location = location;
  if (mode) job.mode = mode;
  if (minCgpa !== undefined) job.minCgpa = minCgpa;
  if (deadline) job.deadline = deadline;
  if (openings !== undefined) job.openings = openings;
  if (isActive !== undefined) job.isActive = isActive;

  if (allowedBranches) {
    job.allowedBranches = Array.isArray(allowedBranches)
      ? allowedBranches
      : allowedBranches.split(",").map((b) => b.trim());
  }

  if (skillsRequired) {
    job.skillsRequired = Array.isArray(skillsRequired)
      ? skillsRequired
      : skillsRequired.split(",").map((s) => s.trim());
  }

  // Re-approval after update
  job.approvalStatus = APPROVAL_STATUS.PENDING;

  await job.save();

  successResponse(
    res,
    "Job updated successfully and sent again for admin approval",
    job
  );
});

/**
 * @desc    Delete own company job
 * @route   DELETE /api/jobs/:id
 * @access  Private (Company)
 */
export const deleteMyJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    company: req.user._id,
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found or unauthorized access");
  }

  await job.deleteOne();

  successResponse(res, "Job deleted successfully");
});