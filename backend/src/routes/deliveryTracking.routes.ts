// src/routes/deliveryTracking.routes.ts
import express, { Request, Response } from 'express';
import { addClient, removeClient, getLast } from '../services/trackingService.js';
import { deliveryTracking } from '../controllers/tracker.controller.js';

const router = express.Router();

// SSE stream for clients (patient/pharmacy)
router.get('/:orderId/stream', async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  // Basic SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // send a comment to open connection
  res.write(`:connected\n\n`);

  addClient(orderId, res);

  // send last known update if we have one
  const last = getLast(orderId);
  if (last) {
    res.write(`data: ${JSON.stringify(last)}\n\n`);
  }

  req.on('close', () => {
    removeClient(orderId, res);
  });
});

// Driver posts location updates here
// Body: { driverId, lat, lng, status, timestamp }
router.post('/:orderId/location', deliveryTracking);

export default router;
