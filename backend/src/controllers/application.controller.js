import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import Application from "../models/Application.model.js";
import Job from "../models/Job.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import { APPLICATION_STATUS } from "../utils/constants.js";
import { checkStudentEligibilityForJob } from "../services/eligibility.service.js";
import { createNotification } from "../services/notification.service.js";

/**
 * @desc    Student applies to a job
 * @route   POST /api/applications/:jobId
 * @access  Private (Student)
 */
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter } = req.body;

  const eligibility = await checkStudentEligibilityForJob({
    studentUserId: req.user._id,
    jobId,
    preventMultipleOffers: true,
  });

  if (!eligibility.isEligible) {
    res.status(400);
    throw new Error(eligibility.reason);
  }

  const { studentProfile, job } = eligibility;

  const application = await Application.create({
    student: req.user._id,
    studentProfile: studentProfile._id,
    job: job._id,
    company: job.company,
    status: APPLICATION_STATUS.APPLIED,
    coverLetter: coverLetter || "",
  });

  // Increase applicants count
  job.applicantsCount += 1;
  await job.save();

  // Notify student
  await createNotification({
    recipient: req.user._id,
    title: "Application Submitted",
    message: `You successfully applied for ${job.role}`,
    type: "APPLICATION",
    relatedJob: job._id,
    relatedApplication: application._id,
  });

  successResponse(res, "Job application submitted successfully", application, 201);
});

/**
 * @desc    Company updates application status
 * @route   PUT /api/applications/:applicationId/status
 * @access  Private (Company)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!Object.values(APPLICATION_STATUS).includes(status)) {
    res.status(400);
    throw new Error("Invalid application status");
  }

  const application = await Application.findById(applicationId)
    .populate("job")
    .populate("student")
    .populate("studentProfile");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // Company can only update its own applicants
  if (application.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Unauthorized to update this application");
  }

  // Prevent selecting already placed student
  if (
    status === APPLICATION_STATUS.SELECTED &&
    application.studentProfile.isPlaced
  ) {
    res.status(400);
    throw new Error("Student is already selected for another job");
  }

  application.status = status;

  if (status === APPLICATION_STATUS.SHORTLISTED) {
    application.shortlistedAt = new Date();
  }

  if (status === APPLICATION_STATUS.REJECTED) {
    application.rejectedAt = new Date();
  }

  if (status === APPLICATION_STATUS.SELECTED) {
    application.selectedAt = new Date();

    // Mark student as placed
    const studentProfile = await StudentProfile.findById(
      application.studentProfile._id
    );

    studentProfile.isPlaced = true;
    studentProfile.selectedJob = application.job._id;
    await studentProfile.save();
  }

  await application.save();

  // Notify student
  await createNotification({
    recipient: application.student._id,
    title: "Application Status Updated",
    message: `Your application for ${application.job.role} is now "${status}"`,
    type: "STATUS_UPDATE",
    relatedJob: application.job._id,
    relatedApplication: application._id,
  });

  successResponse(res, "Application status updated successfully", application);
});

/**
 * @desc    Get applications for logged-in student
 * @route   GET /api/applications/student
 * @access  Private (Student)
 */
export const getStudentApplications = asyncHandler(async (req, res) => {
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

/**
 * @desc    Get applications for logged-in company
 * @route   GET /api/applications/company
 * @access  Private (Company)
 */
export const getCompanyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ company: req.user._id })
    .populate("student", "fullName email")
    .populate("studentProfile", "branch cgpa skills resume")
    .populate("job", "role ctc")
    .sort({ createdAt: -1 });

  successResponse(res, "Company applications fetched successfully", applications);
});