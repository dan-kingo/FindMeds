// src/services/trackingService.ts
import { ServerResponse } from 'http';

type LocationPayload = {
  orderId: string;
  driverId?: string | null;
  lat: number;
  lng: number;
  status?: string;
  timestamp?: number;
  eta?: number | null;
};

type OrderEntry = {
  clients: Set<ServerResponse>;
  last?: LocationPayload | null;
};

const deliveries = new Map<string, OrderEntry>();

export function ensureOrder(orderId: string) {
  if (!deliveries.has(orderId)) {
    deliveries.set(orderId, { clients: new Set(), last: null });
  }
  return deliveries.get(orderId)!;
}

export function addClient(orderId: string, res: ServerResponse) {
  const order = ensureOrder(orderId);
  order.clients.add(res);
}

export function removeClient(orderId: string, res: ServerResponse) {
  const order = deliveries.get(orderId);
  if (!order) return;
  order.clients.delete(res);
  if (order.clients.size === 0 && !order.last) {
    deliveries.delete(orderId);
  }
}

export function broadcast(orderId: string, payload: LocationPayload) {
  const order = ensureOrder(orderId);
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of order.clients) {
    try {
      res.write(data);
    } catch (err) {
      // ignore write errors; client will close and we clean on 'close'
    }
  }
  order.last = payload;
}

export function getLast(orderId: string) {
  const order = deliveries.get(orderId);
  return order ? order.last : null;
}
