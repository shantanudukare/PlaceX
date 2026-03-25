import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root uploads dir
const uploadsRoot = path.join(__dirname, "../../uploads");
const photoDir = path.join(uploadsRoot, "photos");
const resumeDir = path.join(uploadsRoot, "resumes");
const logoDir = path.join(uploadsRoot, "logos");

// Ensure folders exist
[uploadsRoot, photoDir, resumeDir, logoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, photoDir);
    } else if (file.fieldname === "resume") {
      cb(null, resumeDir);
    } else if (file.fieldname === "logo") {
      cb(null, logoDir);
    } else {
      cb(null, uploadsRoot);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed for resume"), false);
    }
  }

  if (file.fieldname === "photo" || file.fieldname === "logo") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed for photo/logo"), false);
    }
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});