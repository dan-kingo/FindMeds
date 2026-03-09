import { Request, Response } from 'express';
import Order from '../models/order.js';
import { broadcast } from '../services/trackingService.js';

// Calculate distance between two coordinates using Haversine formula (in km)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate ETA based on distance and average speed (30 km/h default)
function calculateETA(distanceKm: number, averageSpeedKmh: number = 30): Date {
  const hoursNeeded = distanceKm / averageSpeedKmh;
  const minutesNeeded = hoursNeeded * 60;
  return new Date(Date.now() + minutesNeeded * 60 * 1000);
}

export const deliveryTracking = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const { driverId, lat, lng, status, timestamp } = req.body || {};

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      res.status(400).json({ error: 'lat and lng must be numbers' });
      return;
    }

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Calculate distance to destination if delivery address exists
    let distance = order.delivery?.distance || 0;
    let eta: Date | null = null;

    if (order.location?.coordinates && order.location.coordinates.length === 2) {
      const [destLng, destLat] = order.location.coordinates;
      distance = calculateDistance(lat, lng, destLat, destLng);
      eta = calculateETA(distance);
    }

    // Update order with current location and tracking history
    const locationUpdate = {
      location: {
        type: 'Point' as const,
        coordinates: [lng, lat]
      },
      timestamp: new Date(timestamp || Date.now()),
      status: status || 'en_route'
    };

    // Initialize delivery object if not exists
    if (!order.delivery) {
      order.delivery = {} as any;
    }

    // Update delivery information
    if (order.delivery) {
      order.delivery.driverId = driverId || order.delivery.driverId;
      order.delivery.currentLocation = {
        type: 'Point',
        coordinates: [lng, lat]
      };
      order.delivery.distance = distance;
      order.delivery.lastUpdated = new Date();

      if (eta) {
        order.delivery.estimatedDeliveryTime = eta;
      }

      // Initialize tracking history if not exists
      if (!order.delivery.trackingHistory) {
        order.delivery.trackingHistory = [] as any;
      }

      // Add to tracking history
      order.delivery.trackingHistory.push(locationUpdate as any);

      // If delivered, record actual delivery time
      if (status === 'delivered' || order.status === 'Delivered') {
        order.delivery.actualDeliveryTime = new Date();
      }
    }

    // Save to database
    await order.save();

    // Prepare broadcast payload
    const payload = {
      orderId,
      driverId: driverId || null,
      lat,
      lng,
      status: status || 'en_route',
      timestamp: timestamp || Date.now(),
      eta: eta ? eta.getTime() : null,
      distance: distance
    };

    // Broadcast to SSE subscribers
    broadcast(orderId, payload);

    res.json({
      ok: true,
      payload,
      message: 'Location updated successfully'
    });
  } catch (err) {
    console.error('Error posting location', err);
    res.status(500).json({ error: 'Internal error' });
  }
};