import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface VehicleMapProps {
  latitude: number;
  longitude: number;
  label: string;
}

export const VehicleMap: React.FC<VehicleMapProps> = ({
  latitude,
  longitude,
  label,
}) => {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-300 shadow-inner">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            Bus <b>{label}</b> berada di sini.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
