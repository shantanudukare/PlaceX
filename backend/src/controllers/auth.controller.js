import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { successResponse } from "../utils/apiResponse.js";
import User from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import CompanyProfile from "../models/CompanyProfile.model.js";
import { createStudentAccount, createCompanyAccount } from "../services/auth.service.js";
import { APPROVAL_STATUS, ROLES } from "../utils/constants.js";

// Helper to set cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * @desc    Register student
 * @route   POST /api/auth/signup/student
 * @access  Public
 */
export const signupStudent = asyncHandler(async (req, res) => {
  const { fullName, email, password, branch, cgpa, phone, skills, projects } =
    req.body;

  if (!fullName || !email || !password || !branch || cgpa === undefined) {
    res.status(400);
    throw new Error("Please provide all required student fields");
  }

  const { user, studentProfile } = await createStudentAccount({
    fullName,
    email,
    password,
    branch,
    cgpa,
    phone,
    skills,
    projects,
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  setTokenCookie(res, token);

  successResponse(
    res,
    "Student account created successfully. Waiting for admin approval.",
    {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
      },
      studentProfile,
    },
    201
  );
});

/**
 * @desc    Register company
 * @route   POST /api/auth/signup/company
 * @access  Public
 */
export const signupCompany = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    companyName,
    website,
    description,
    industry,
    location,
    hrName,
    hrEmail,
    hrPhone,
  } = req.body;

  if (!fullName || !email || !password || !companyName) {
    res.status(400);
    throw new Error("Please provide all required company fields");
  }

  const { user, companyProfile } = await createCompanyAccount({
    fullName,
    email,
    password,
    companyName,
    website,
    description,
    industry,
    location,
    hrName,
    hrEmail,
    hrPhone,
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  setTokenCookie(res, token);

  successResponse(
    res,
    "Company account created successfully. Waiting for admin approval.",
    {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
      },
      companyProfile,
    },
    201
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error("Your account is blocked");
  }

  // Admin can login directly
  // Student & Company can login even if pending, but frontend can restrict features
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  setTokenCookie(res, token);

  let profile = null;

  if (user.role === ROLES.STUDENT) {
    profile = await StudentProfile.findOne({ user: user._id });
  }

  if (user.role === ROLES.COMPANY) {
    profile = await CompanyProfile.findOne({ user: user._id });
  }

  successResponse(res, "Login successful", {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus,
    },
    profile,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  successResponse(res, "Logged out successfully");
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  let profile = null;

  if (req.user.role === ROLES.STUDENT) {
    profile = await StudentProfile.findOne({ user: req.user._id });
  }

  if (req.user.role === ROLES.COMPANY) {
    profile = await CompanyProfile.findOne({ user: req.user._id });
  }

  successResponse(res, "Current user fetched successfully", {
    user: req.user,
    profile,
  });
});