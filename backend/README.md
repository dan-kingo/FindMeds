# MedStream Backend

## Environment variables
Set these in your `.env`:

- `MONGO_URI` (or `MONGO_LOCAL_URL`)
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_PRESCRIPTIONS_FOLDER` (optional, default: `medstream/prescriptions`)
 - `CLOUDINARY_MEDICINES_FOLDER` (optional, default: `medstream/medicines`)

## Prescription uploads
- Endpoint: `POST /api/orders` with `multipart/form-data`.
- Field name: `prescription` (file). Allowed types: JPG/PNG/PDF. Max size: 5MB.
- Uploaded files are streamed to Cloudinary; the order `prescriptionUrl` stores the returned `secure_url`.

## Medicine image uploads
- Add medicine: `POST /api/medicines` with `multipart/form-data` (auth required).
	- Fields: `name`, `type`, `price`, `quantity`, optional `strength`, `unit`, `description`, `requiresPrescription`.
	- File: `image` (JPG/PNG/WEBP, max 5MB).
- Update medicine image: `PUT /api/medicines/:id` with the same payload; include `image` to replace.
- Responses include `imageUrl` with the Cloudinary secure URL.

## Local setup
```
npm install
npm run dev
```

Ensure env vars are loaded before starting the server.
