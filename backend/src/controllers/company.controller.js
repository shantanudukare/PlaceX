import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import CompanyProfile from "../models/CompanyProfile.model.js";
import User from "../models/User.model.js";
import Job from "../models/Job.model.js";
import Application from "../models/Application.model.js";

/**
 * @desc    Get logged-in company profile
 * @route   GET /api/companies/me
 * @access  Private (Company)
 */
export const getMyCompanyProfile = asyncHandler(async (req, res) => {
  const profile = await CompanyProfile.findOne({ user: req.user._id }).populate(
    "user",
    "fullName email role approvalStatus"
  );

  if (!profile) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  successResponse(res, "Company profile fetched successfully", profile);
});

/**
 * @desc    Update logged-in company profile
 * @route   PUT /api/companies/me
 * @access  Private (Company)
 */
export const updateMyCompanyProfile = asyncHandler(async (req, res) => {
  const {
    fullName,
    companyName,
    website,
    description,
    industry,
    location,
    hrName,
    hrEmail,
    hrPhone,
  } = req.body;

  const user = await User.findById(req.user._id);
  const profile = await CompanyProfile.findOne({ user: req.user._id });

  if (!user || !profile) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  if (fullName) user.fullName = fullName;

  if (companyName) profile.companyName = companyName;
  if (website) profile.website = website;
  if (description) profile.description = description;
  if (industry) profile.industry = industry;
  if (location) profile.location = location;
  if (hrName) profile.hrName = hrName;
  if (hrEmail) profile.hrEmail = hrEmail;
  if (hrPhone) profile.hrPhone = hrPhone;

  await user.save();
  await profile.save();

  const updatedProfile = await CompanyProfile.findOne({
    user: req.user._id,
  }).populate("user", "fullName email role approvalStatus");

  successResponse(res, "Company profile updated successfully", updatedProfile);
});

/**
 * @desc    Upload company logo
 * @route   PUT /api/companies/upload-logo
 * @access  Private (Company)
 */
export const uploadCompanyLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Logo file is required");
  }

  const profile = await CompanyProfile.findOne({ user: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  profile.logo = {
    url: `/uploads/logos/${req.file.filename}`,
    public_id: req.file.filename,
  };

  await profile.save();

  successResponse(res, "Logo uploaded successfully", profile.logo);
});

/**
 * @desc    Get all jobs posted by logged-in company
 * @route   GET /api/companies/my-jobs
 * @access  Private (Company)
 */
export const getMyCompanyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ company: req.user._id })
    .populate("companyProfile", "companyName logo")
    .sort({ createdAt: -1 });

  successResponse(res, "Company jobs fetched successfully", jobs);
});

/**
 * @desc    Get applicants for company's own job
 * @route   GET /api/companies/job/:jobId/applicants
 * @access  Private (Company)
 */
export const getApplicantsForMyJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    company: req.user._id,
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found or unauthorized access");
  }

  const applicants = await Application.find({ job: jobId })
    .populate("student", "fullName email")
    .populate("studentProfile")
    .populate("job", "role ctc")
    .sort({ createdAt: -1 });

  successResponse(res, "Applicants fetched successfully", applicants);
});