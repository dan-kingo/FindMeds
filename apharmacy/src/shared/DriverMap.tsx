import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = { position: { lat: number; lng: number } | null };

export default function DriverMap({ position }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    mapRef.current = L.map(elRef.current).setView([9.01, 38.76], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !position) return;
    const latlng = [position.lat, position.lng] as [number, number];
    if (!markerRef.current) {
      markerRef.current = L.marker(latlng).addTo(mapRef.current!);
      mapRef.current.setView(latlng, 15);
    } else {
      markerRef.current.setLatLng(latlng);
    }
  }, [position]);

  return <div ref={elRef} style={{ height: '100%', minHeight: 480 }} />;
}
