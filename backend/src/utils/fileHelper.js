import path from "path";

export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

export const isPdf = (mimetype) => {
  return mimetype === "application/pdf";
};

export const isImage = (mimetype) => {
  return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
    mimetype
  );
};