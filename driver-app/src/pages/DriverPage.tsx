import { useEffect, useState } from 'react';
import DriverMap from '../shared/DriverMap';
import useInterval from '../shared/useInterval';

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || 'https://medstream.onrender.com';

export default function DriverPage() {
  const [orderId, setOrderId] = useState('order-123');
  const [driverId, setDriverId] = useState('driver-1');
  const [status, setStatus] = useState<'assigned'|'picked_up'|'en_route'|'delivered'>('assigned');
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  // get browser geolocation
  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.warn('geolocation err', err),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // POST location every 3s when status is en_route or picked_up or assigned
  useInterval(() => {
    if (!position) return;
    // send update
    fetch(`${BACKEND_BASE}/api/deliveries/${encodeURIComponent(orderId)}/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' /* add Authorization header if using auth */ },
      body: JSON.stringify({
        driverId,
        lat: position.lat,
        lng: position.lng,
        status,
        timestamp: Date.now()
      })
    }).catch((e) => console.error('send location error', e));
  }, 3000, status !== 'delivered');

  // simple UI
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ width: 360 }}>
        <h2>Driver Simulator</h2>
        <label>Order ID: <input value={orderId} onChange={e => setOrderId(e.target.value)} /></label><br/>
        <label>Driver ID: <input value={driverId} onChange={e => setDriverId(e.target.value)} /></label><br/>
        <div>
          Status:
          <select value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="assigned">assigned</option>
            <option value="picked_up">picked_up</option>
            <option value="en_route">en_route</option>
            <option value="delivered">delivered</option>
          </select>
        </div>
        <p>Current position: {position ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}` : 'n/a'}</p>
      </div>

      <div style={{ flex: 1, minHeight: 480 }}>
        <DriverMap position={position} />
      </div>
    </div>
  );
}
