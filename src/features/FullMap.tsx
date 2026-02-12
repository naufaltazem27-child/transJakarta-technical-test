import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Bus,
  MapPin,
  Navigation,
  Clock,
  Route as RouteIcon,
} from "lucide-react";
import type { Vehicle } from "../types/vehicles";
import { StatusBadge } from "../components/ui/StatusBadge";
import "leaflet/dist/leaflet.css";

// --- Custom Marker Icon ---
const createBusIcon = (isSelected: boolean) => {
  const iconHtml = renderToStaticMarkup(
    <div
      className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-xl transition-all ${
        isSelected
          ? "bg-[#06367C] border-white scale-125 z-50"
          : "bg-white border-[#06367C]"
      }`}
    >
      <Bus size={20} className={isSelected ? "text-white" : "text-[#06367C]"} />
      <div
        className={`absolute -bottom-1.5 w-3 h-3 rotate-45 border-r-2 border-b-2 ${
          isSelected ? "bg-[#06367C] border-white" : "bg-white border-[#06367C]"
        }`}
      ></div>
    </div>,
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-bus-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 45],
    popupAnchor: [180, -10],
  });
};

// --- Map Controller ---
const MapUpdater = ({
  center,
  zoom,
}: {
  center: [number, number] | null;
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.5 });
    }
  }, [center, zoom, map]);
  return null;
};

// --- Main Component ---
interface FullMapProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelect: (vehicle: Vehicle) => void;
}

export const FullMap: React.FC<FullMapProps> = ({
  vehicles,
  selectedVehicle,
  onSelect,
}) => {
  return (
    <div className="h-full w-full bg-slate-100 relative z-0">
      {/* INJECT CSS KHUSUS UNTUK POPUP LEAFLET */}
      <style>
        {`
          /* Menghilangkan padding & border default leaflet */
          .custom-popup-clean .leaflet-popup-content-wrapper {
            background: transparent;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-radius: 16px;
            padding: 0;
            overflow: hidden;
          }
          
          /* Mengatur margin konten agar rapat */
          .custom-popup-clean .leaflet-popup-content {
            margin: 0 !important;
            width: 300px !important;
          }

          /* Mewarnai dan rotasi panah untuk menunjuk ke kiri (ke marker) */
          .custom-popup-clean .leaflet-popup-tip-container {
            left: -10px;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 0;
          }
          
          .custom-popup-clean .leaflet-popup-tip {
            background: white;
            transform: rotate(45deg);
            box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.05);
          }

          /* Custom tombol close (X) agar terlihat di header biru */
          .custom-popup-clean a.leaflet-popup-close-button {
            color: rgba(255,255,255,0.8) !important;
            font-size: 18px !important;
            top: 8px !important;
            right: 8px !important;
            transition: all 0.2s;
          }
          .custom-popup-clean a.leaflet-popup-close-button:hover {
            color: white !important;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
          }
        `}
      </style>

      <MapContainer
        center={[42.3601, -71.0589]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater
          center={
            selectedVehicle
              ? [
                  selectedVehicle.attributes.latitude,
                  selectedVehicle.attributes.longitude,
                ]
              : null
          }
          zoom={16}
        />

        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[
              vehicle.attributes.latitude,
              vehicle.attributes.longitude,
            ]}
            icon={createBusIcon(selectedVehicle?.id === vehicle.id)}
            eventHandlers={{
              click: () => onSelect(vehicle),
            }}
          >
            <Popup className="custom-popup-clean" closeButton={true}>
              {/* --- CUSTOM POPUP CONTENT --- */}
              <div className="bg-white flex flex-col">
                {/* Header Biru */}
                <div className="bg-[#06367C] px-4 py-3 text-white relative">
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/20">
                      <Bus size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight">
                        Bus {vehicle.attributes.label}
                      </h3>
                      <p className="text-blue-100 text-xs mt-0.5 font-mono opacity-80">
                        ID: {vehicle.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                  {/* Status & Time */}
                  <div className="flex justify-between items-center">
                    <StatusBadge status={vehicle.attributes.current_status} />
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
                      <Clock size={10} />
                      {new Date(
                        vehicle.attributes.updated_at,
                      ).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full"></div>

                  {/* Route Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 mb-1">
                        <RouteIcon size={10} /> Rute
                      </span>
                      <span className="text-sm font-bold text-gray-800 truncate block">
                        {vehicle.relationships.route.data?.id || "-"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 mb-1">
                        <Navigation size={10} /> Trip
                      </span>
                      <span
                        className="text-sm font-mono text-gray-600 truncate block"
                        title={vehicle.relationships.trip.data?.id || ""}
                      >
                        {vehicle.relationships.trip.data?.id?.substring(0, 8) ||
                          "-"}
                        <span className="text-gray-300">...</span>
                      </span>
                    </div>
                  </div>

                  {/* Location Footer */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#F8F9FC] p-2 rounded-md border border-gray-100">
                    <MapPin size={12} className="text-[#06367C] shrink-0" />
                    <span className="truncate font-mono">
                      {vehicle.attributes.latitude.toFixed(5)},{" "}
                      {vehicle.attributes.longitude.toFixed(5)}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
