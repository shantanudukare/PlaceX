import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    githubLink: {
      type: String,
      trim: true,
    },
    liveLink: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
    },

    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: 0,
      max: 10,
    },

    phone: {
      type: String,
      trim: true,
    },

    photo: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    resume: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
      originalName: {
        type: String,
        default: "",
      },
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    projects: [projectSchema],

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    isPlaced: {
      type: Boolean,
      default: false,
    },

    selectedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;