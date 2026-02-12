import { BusFront, MapPin, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { Vehicle } from "../../types/vehicles";

interface VehicleCardProps {
  data: Vehicle;
  onClick: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ data, onClick }) => {
  const { attributes } = data;

  const lastUpdate = new Date(attributes.updated_at).toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  );

  return (
    <div
      onClick={() => onClick(data)}
      className="group bg-white rounded-xl border border-gray-200 hover:border-[#06367C]/30 transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-lg hover:shadow-[#06367C]/5"
    >
      {/* Main Content */}
      <div className="p-5">
        {/* Header: Icon + Title + Status */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Icon Container */}
            <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl flex items-center justify-center border border-blue-100 group-hover:border-[#06367C]/20 group-hover:from-blue-100 group-hover:to-blue-200/50 transition-all duration-200">
              <BusFront className="text-[#06367C]" size={22} strokeWidth={2} />
            </div>

            {/* Title & ID */}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-base mb-0.5 truncate group-hover:text-[#06367C] transition-colors">
                Bus {attributes.label}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium font-mono truncate">
                {data.id}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            <StatusBadge status={attributes.current_status} />
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-3">
          {/* Coordinate */}
          <div className="flex items-start gap-2.5">
            <div className="shrink-0 w-5 h-5 flex items-center justify-center">
              <MapPin size={16} className="text-gray-400" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Koordinat
              </p>
              <span className="inline-block font-mono text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                {attributes.latitude.toFixed(4)},{" "}
                {attributes.longitude.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Last Update */}
          <div className="flex items-start gap-2.5">
            <div className="shrink-0 w-5 h-5 flex items-center justify-center">
              <Clock size={16} className="text-gray-400" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Last Update
              </p>
              <div className="flex items-center gap-1.5">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {lastUpdate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 px-5 py-3 border-t border-gray-100 group-hover:from-blue-50/50 group-hover:to-blue-100/30 group-hover:border-blue-100 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#06367C] group-hover:underline underline-offset-2">
            Lihat Detail
          </span>
          <svg
            className="w-4 h-4 text-[#06367C] transform group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
