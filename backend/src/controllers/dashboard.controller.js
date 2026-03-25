import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  getAdminDashboardStatsService,
  getCompanyDashboardStatsService,
  getStudentDashboardStatsService,
} from "../services/dashboard.service.js";

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin)
 */
export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const stats = await getAdminDashboardStatsService();

  successResponse(res, "Admin dashboard stats fetched successfully", stats);
});

/**
 * @desc    Get company dashboard stats
 */
export const getCompanyDashboardStats = asyncHandler(async (req, res) => {
  const stats = await getCompanyDashboardStatsService(req.user._id);

  successResponse(res, "Company dashboard stats fetched successfully", stats);
});

/**
 * @desc    Get student dashboard stats
 */
export const getStudentDashboardStats = asyncHandler(async (req, res) => {
  const stats = await getStudentDashboardStatsService(req.user._id);

  successResponse(res, "Student dashboard stats fetched successfully", stats);
});