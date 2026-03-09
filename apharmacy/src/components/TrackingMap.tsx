// src/components/TrackingMap.tsx
import { useEffect, useState } from 'react';
import DriverMap from '../shared/DriverMap';

const API_BASE_URL =  'https://medstream.onrender.com';

interface TrackingData {
  lat: number;
  lng: number;
  status: string;
  eta: number | null;
  distance: number;
  timestamp: number;
}

interface TrackingMapProps {
  orderId: string;
  onTrackingUpdate?: (data: TrackingData) => void;
}

export default function TrackingMap({ orderId, onTrackingUpdate }: TrackingMapProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<string>('Waiting for driver...');
  const [eta, setEta] = useState<string>('');
  const [distance, setDistance] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('auth-storage');
    let authToken = '';
    if (token) {
      try {
        const parsed = JSON.parse(token);
        authToken = parsed.state?.token || '';
      } catch {}
    }

    const url = `${API_BASE_URL}/api/deliveries/${encodeURIComponent(orderId)}/stream`;
    const eventSource = new EventSource(url, {
      // @ts-ignore - EventSource doesn't support headers natively
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });

    eventSource.onmessage = (event) => {
      if (event.data === ':connected') return;
      try {
        const data = JSON.parse(event.data) as TrackingData;
        setPosition({ lat: data.lat, lng: data.lng });
        setStatus(data.status);
        setDistance(data.distance.toFixed(2) + ' km');
        setEta(data.eta ? new Date(data.eta).toLocaleTimeString() : 'Calculating...');
        onTrackingUpdate?.(data);
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    };

    eventSource.onerror = () => {
      console.warn('SSE connection lost. Retrying...');
      eventSource.close();
      // Auto-reconnect handled by browser
    };

    return () => {
      eventSource.close();
    };
  }, [orderId, onTrackingUpdate]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <div>
          <span className="font-medium">Status:</span>{' '}
          <span className="capitalize">{status}</span>
        </div>
        <div>
          <span className="font-medium">Distance:</span> {distance}
        </div>
        <div>
          <span className="font-medium">ETA:</span> {eta}
        </div>
      </div>
      <div style={{ height: 320, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <DriverMap position={position} />
      </div>
      {!position && (
        <p className="text-center text-gray-500 text-sm">Waiting for driver location...</p>
      )}
    </div>
  );
}