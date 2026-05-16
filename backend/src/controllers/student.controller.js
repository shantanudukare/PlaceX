import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import StudentProfile from "../models/StudentProfile.model.js";
import User from "../models/User.model.js";
import Job from "../models/Job.model.js";
import Application from "../models/Application.model.js";
import { APPROVAL_STATUS } from "../utils/constants.js";

/**
 * @desc    Get logged-in student's profile
 * @route   GET /api/students/me
 * @access  Private (Student)
 */
export const getMyStudentProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).populate(
    "user",
    "fullName email role approvalStatus"
  );

  if (!profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  successResponse(res, "Student profile fetched successfully", profile);
});

/**
 * @desc    Update logged-in student's profile
 * @route   PUT /api/students/me
 * @access  Private (Student)
 */
export const updateMyStudentProfile = asyncHandler(async (req, res) => {
  const { fullName, branch, cgpa, phone, skills, projects } = req.body;

  const user = await User.findById(req.user._id);
  const profile = await StudentProfile.findOne({ user: req.user._id });

  if (!user || !profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  if (fullName) user.fullName = fullName;
  if (branch) profile.branch = branch;
  if (cgpa !== undefined) profile.cgpa = cgpa;
  if (phone) profile.phone = phone;
  if (skills) profile.skills = skills;
  if (projects) profile.projects = projects;

  await user.save();
  await profile.save();

  const updatedProfile = await StudentProfile.findOne({
    user: req.user._id,
  }).populate("user", "fullName email role approvalStatus");

  successResponse(res, "Student profile updated successfully", updatedProfile);
});

/**
 * @desc    Upload student photo
 * @route   PUT /api/students/upload-photo
 * @access  Private (Student)
 */
export const uploadStudentPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Photo file is required");
  }

  const profile = await StudentProfile.findOne({ user: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  profile.photo = {
    url: `/uploads/photos/${req.file.filename}`,
    public_id: req.file.filename,
  };

  await profile.save();

  successResponse(res, "Photo uploaded successfully", profile.photo);
});

/**
 * @desc    Upload student resume
 * @route   PUT /api/students/upload-resume
 * @access  Private (Student)
 */
export const uploadStudentResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Resume file is required");
  }

  const profile = await StudentProfile.findOne({ user: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  profile.resume = {
    url: `/uploads/resumes/${req.file.filename}`,
    public_id: req.file.filename,
    originalName: req.file.originalname,
  };

  await profile.save();

  successResponse(res, "Resume uploaded successfully", profile.resume);
});

/**
 * @desc    Get all jobs student is eligible for
 * @route   GET /api/students/eligible-jobs
 * @access  Private (Student)
 */
export const getEligibleJobsForStudent = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const now = new Date();

  const jobs = await Job.find({
  approvalStatus: APPROVAL_STATUS.APPROVED,
  isActive: true,
})
    .populate("company", "fullName email")
    .populate("companyProfile", "companyName logo location")
    .sort({ createdAt: -1 });

  successResponse(res, "Eligible jobs fetched successfully", jobs);
});

/**
 * @desc    Get my applications
 * @route   GET /api/students/my-applications
 * @access  Private (Student)
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .populate({
      path: "job",
      populate: {
        path: "companyProfile",
        select: "companyName logo location",
      },
    })
    .sort({ createdAt: -1 });

  successResponse(res, "Student applications fetched successfully", applications);
});