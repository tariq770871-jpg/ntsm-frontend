import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const engineers = [
  { id: 1, name: 'م. أحمد', lat: 24.7136, lng: 46.6753, status: 'online' },
  { id: 2, name: 'م. خالد', lat: 24.7500, lng: 46.7000, status: 'offline' },
];

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-120px)] rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={[24.7136, 46.6753]} zoom={12} className="h-full w-full z-0">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {engineers.map(eng => (
          <Marker key={eng.id} position={[eng.lat, eng.lng]}>
            <Popup>
              <strong>{eng.name}</strong><br />
              الحالة: <span className={eng.status === 'online' ? 'text-green-500' : 'text-red-500'}>{eng.status}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
