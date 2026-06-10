import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setAddress(`${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapPicker = ({ setAddress }) => {
  // Default to Mogadishu coordinates
  const [position, setPosition] = useState({ lat: 2.0469, lng: 45.3182 });

  return (
    <div className="h-48 w-full rounded-xl overflow-hidden border border-slate-200 mt-2 z-0 relative">
      <MapContainer center={[position.lat, position.lng]} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
      </MapContainer>
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur text-xs px-3 py-1.5 rounded-lg shadow pointer-events-none z-[1000] text-center font-medium text-emerald-800">
        Click on the map to drop a pin for your pickup location
      </div>
    </div>
  );
};

export default MapPicker;
