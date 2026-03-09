// routes/medicine.routes.ts
import express from 'express';
import { addMedicine, deleteMedicine, getMedicineDetails, getMedicines, getMedicinesByPharmacy, getPopularMedicines, markOutOfStock, searchMedicines, updateMedicine } from '../controllers/medicine.controller.js';
import validate, { validateParams } from '../middlewares/validationMiddleware.js';
import { medicineDetailsParamsSchema, medicineSchema } from '../validations/medicine.schema.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { uploadImage } from '../utils/upload.js';

const router = express.Router();

router.get('/search', searchMedicines);
router.get('/popular', getPopularMedicines);
router.get('/pharmacy/:pharmacyId', authenticateUser, getMedicinesByPharmacy);
router.get('/:id', validateParams(medicineDetailsParamsSchema), getMedicineDetails); // Assuming this is for getting details of a specific medicine
router.get('/', authenticateUser, getMedicines);
const parseMedicineBody = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
	const { price, quantity, requiresPrescription } = req.body;
	if (price !== undefined && typeof price === 'string') {
		req.body.price = Number(price);
	}
	if (quantity !== undefined && typeof quantity === 'string') {
		req.body.quantity = Number(quantity);
	}
	if (requiresPrescription !== undefined && typeof requiresPrescription === 'string') {
		req.body.requiresPrescription = requiresPrescription === 'true';
	}
	next();
};

router.post('/', authenticateUser, uploadImage.single('image'), parseMedicineBody, validate(medicineSchema), addMedicine);
router.put('/:id', authenticateUser, uploadImage.single('image'), parseMedicineBody, updateMedicine);
router.delete('/:id', authenticateUser, deleteMedicine);
router.patch('/:id/out-of-stock', authenticateUser, markOutOfStock);
export default router;
