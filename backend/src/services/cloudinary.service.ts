import { Readable } from 'stream';
import cloudinary from '../configs/cloudinary.js';

const PRESCRIPTION_FOLDER = process.env.CLOUDINARY_PRESCRIPTIONS_FOLDER || 'medstream/prescriptions';
const MEDICINE_FOLDER = process.env.CLOUDINARY_MEDICINES_FOLDER || 'medstream/medicines';

export const uploadPrescription = async (file: Express.Multer.File): Promise<string> => {
  if (!file || !file.buffer) {
    throw new Error('No file buffer provided for upload');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: PRESCRIPTION_FOLDER,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Prescription upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

export const uploadMedicineImage = async (file: Express.Multer.File): Promise<string> => {
  if (!file || !file.buffer) {
    throw new Error('No file buffer provided for upload');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: MEDICINE_FOLDER,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Medicine image upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};
