// src/utils/upload.ts
import multer from 'multer';

// Use in-memory storage so files can be streamed directly to Cloudinary.
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit to prevent oversized uploads
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only JPG, PNG, and PDF files are allowed for prescriptions'));
  },
});

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit to prevent oversized uploads
  },
  fileFilter: (_req, file, cb) => 
    ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only image files are allowed')), 
});
