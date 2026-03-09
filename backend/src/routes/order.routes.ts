// src/routes/orderRoutes.ts
import express from 'express';

import { upload } from '../utils/upload.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { getIncomingOrders, getMyOrders, getOrderById, getSalesOverview, placeOrder, updateOrderStatus, updateOrderStatuses } from '../controllers/order.controller.js';
import validate from '../middlewares/validationMiddleware.js';
import { placeOrderBodySchema, updateOrderStatusSchema } from '../validations/order.schema.js';

const router = express.Router();

// Parse JSON-encoded fields when the request is multipart/form-data
const parseOrderBody = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  try {
    if (typeof req.body.items === 'string') {
      req.body.items = JSON.parse(req.body.items);
    }

    if (typeof req.body.location === 'string') {
      req.body.location = JSON.parse(req.body.location);
    }
  } catch (err) {
    // If parsing fails, let validation handle the error
    console.error('Failed to parse order multipart body:', err);
  }

  next();
};

router.get('/sales-review', authenticateUser, getSalesOverview);
router.post(
  '/',
  authenticateUser,
  upload.single('prescription'),
  parseOrderBody,
  validate(placeOrderBodySchema),
  placeOrder
);

router.get('/my', authenticateUser,  getMyOrders); 
export default router;
router.get('/:id', authenticateUser, getOrderById); 
router.patch(
  '/:id/status',
  authenticateUser,
  validate(updateOrderStatusSchema),
updateOrderStatus)
 
router.get('/', authenticateUser, getIncomingOrders);
router.post('/status', authenticateUser, validate(updateOrderStatusSchema), updateOrderStatuses);
