import User from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import CompanyProfile from "../models/CompanyProfile.model.js";
import Job from "../models/Job.model.js";
import Application from "../models/Application.model.js";
import { APPROVAL_STATUS, ROLES, APPLICATION_STATUS } from "../utils/constants.js";

export const getAdminDashboardStatsService = async () => {
  const [
    totalStudents,
    totalCompanies,
    totalJobs,
    totalApplications,
    placedStudents,
    notPlacedStudents,
    pendingStudents,
    pendingCompanies,
    pendingJobs,
    selectedApplications,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.STUDENT }),
    User.countDocuments({ role: ROLES.COMPANY }),
    Job.countDocuments(),
    Application.countDocuments(),
    StudentProfile.countDocuments({ isPlaced: true }),
    StudentProfile.countDocuments({ isPlaced: false }),
    User.countDocuments({
      role: ROLES.STUDENT,
      approvalStatus: APPROVAL_STATUS.PENDING,
    }),
    User.countDocuments({
      role: ROLES.COMPANY,
      approvalStatus: APPROVAL_STATUS.PENDING,
    }),
    Job.countDocuments({
      approvalStatus: APPROVAL_STATUS.PENDING,
    }),
    Application.countDocuments({
      status: APPLICATION_STATUS.SELECTED,
    }),
  ]);

  return {
    totalStudents,
    totalCompanies,
    totalJobs,
    totalApplications,
    placedStudents,
    notPlacedStudents,
    pendingStudents,
    pendingCompanies,
    pendingJobs,
    selectedApplications,
  };
};

export const getCompanyDashboardStatsService = async (companyUserId) => {
  const jobs = await Job.find({ company: companyUserId }).select("_id");

  const jobIds = jobs.map((job) => job._id);

  const [
    totalPostedJobs,
    totalApplications,
    shortlistedCount,
    rejectedCount,
    selectedCount,
  ] = await Promise.all([
    Job.countDocuments({ company: companyUserId }),
    Application.countDocuments({ company: companyUserId }),
    Application.countDocuments({
      company: companyUserId,
      status: "Shortlisted",
    }),
    Application.countDocuments({
      company: companyUserId,
      status: "Rejected",
    }),
    Application.countDocuments({
      company: companyUserId,
      status: "Selected",
    }),
  ]);

  return {
    totalPostedJobs,
    totalApplications,
    shortlistedCount,
    rejectedCount,
    selectedCount,
  };
};

export const getStudentDashboardStatsService = async (studentUserId) => {
  const [totalApplications, shortlistedCount, rejectedCount, selectedCount] =
    await Promise.all([
      Application.countDocuments({ student: studentUserId }),
      Application.countDocuments({
        student: studentUserId,
        status: "Shortlisted",
      }),
      Application.countDocuments({
        student: studentUserId,
        status: "Rejected",
      }),
      Application.countDocuments({
        student: studentUserId,
        status: "Selected",
      }),
    ]);

  return {
    totalApplications,
    shortlistedCount,
    rejectedCount,
    selectedCount,
  };
};