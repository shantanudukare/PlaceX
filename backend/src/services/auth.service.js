import User from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import CompanyProfile from "../models/CompanyProfile.model.js";
import { APPROVAL_STATUS, ROLES } from "../utils/constants.js";

export const createStudentAccount = async (data) => {
  const {
    fullName,
    email,
    password,
    branch,
    cgpa,
    phone,
    skills = [],
    projects = [],
  } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: ROLES.STUDENT,
    approvalStatus: APPROVAL_STATUS.PENDING,
  });

  const studentProfile = await StudentProfile.create({
    user: user._id,
    branch,
    cgpa,
    phone,
    skills,
    projects,
    isProfileComplete: true,
  });

  return { user, studentProfile };
};

export const createCompanyAccount = async (data) => {
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
  } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: ROLES.COMPANY,
    approvalStatus: APPROVAL_STATUS.PENDING,
  });

  const companyProfile = await CompanyProfile.create({
    user: user._id,
    companyName,
    website,
    description,
    industry,
    location,
    hrName,
    hrEmail,
    hrPhone,
    isProfileComplete: true,
  });

  return { user, companyProfile };
};