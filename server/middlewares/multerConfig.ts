import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "training-data/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const combinedFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes =
    /jpeg|jpg|png|pdf|csv|mp3|wav|ogg|m4a|flac|aac|wma|amr|aiff|alac/;

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/csv",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/mp4",
    "audio/x-m4a",
    "audio/flac",
    "audio/aac",
    "audio/x-aiff",
    "audio/x-alac",
    "audio/amr",
    "audio/wma",
  ];

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only allowed file types: images (jpeg, png), PDFs, CSVs, and audio files!"
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 25 },
  fileFilter: combinedFileFilter,
});
