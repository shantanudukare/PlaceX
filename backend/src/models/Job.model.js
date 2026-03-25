import mongoose from "mongoose";
import { APPROVAL_STATUS, JOB_MODE } from "../utils/constants.js";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },

    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    ctc: {
      type: Number,
      required: [true, "CTC is required"],
      min: 0,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    mode: {
      type: String,
      enum: Object.values(JOB_MODE),
      default: JOB_MODE.ONSITE,
    },

    minCgpa: {
      type: Number,
      required: [true, "Minimum CGPA is required"],
      min: 0,
      max: 10,
    },

    allowedBranches: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],

    deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
    },

    approvalStatus: {
      type: String,
      enum: Object.values(APPROVAL_STATUS),
      default: APPROVAL_STATUS.PENDING,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;