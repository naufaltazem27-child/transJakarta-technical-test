import React from "react";
import type { Vehicle } from "../types/vehicles";
import { Bus, ChevronRight, Search, Navigation } from "lucide-react";
import classNames from "classnames";
import { StatusBadge } from "../components/ui/StatusBadge";

interface LiveMapSidebarProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelect: (vehicle: Vehicle) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  loading: boolean;
  totalVehicles: number;
}

export const LiveMapSidebar: React.FC<LiveMapSidebarProps> = ({
  vehicles,
  selectedVehicle,
  onSelect,
  searchTerm,
  onSearchChange,
  loading,
  totalVehicles,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] w-full">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white px-6 py-5 border-b border-gray-200/60 z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Armada Disekitar
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              Realtime tracking system
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-gray-400 group-focus-within:text-[#06367C] transition-colors duration-200"
            />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari ID Bus (Contoh: 1205)..."
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#06367C]/10 focus:border-[#06367C] text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* --- LIST CONTAINER --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#06367C] rounded-full animate-spin"></div>
            <p className="text-xs font-medium">Menyinkronkan data...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray-100 p-5 rounded-2xl mb-4 border border-gray-200">
              <Bus size={40} className="text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-gray-600 font-semibold text-sm mb-1">
              Tidak Ada Armada
            </p>
            <p className="text-gray-400 text-xs text-center max-w-[200px]">
              Tidak ada bus yang sesuai dengan pencarian Anda
            </p>
          </div>
        ) : (
          vehicles.map((vehicle) => {
            const isSelected = selectedVehicle?.id === vehicle.id;

            return (
              <div
                key={vehicle.id}
                onClick={() => onSelect(vehicle)}
                className={classNames(
                  "group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border",
                  isSelected
                    ? "bg-white border-[#06367C] shadow-md shadow-blue-900/5 ring-1 ring-[#06367C]/5 z-10"
                    : "bg-white border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5",
                )}
              >
                {/* Active Indicator Strip */}
                <div
                  className={classNames(
                    "absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300",
                    isSelected
                      ? "bg-[#06367C]"
                      : "bg-transparent group-hover:bg-blue-200",
                  )}
                ></div>

                <div className="pl-2">
                  {/* Top Row: Icon, Name, ID */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Icon */}
                      <div
                        className={classNames(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                          isSelected
                            ? "bg-[#06367C] text-white rotate-0 scale-110"
                            : "bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-[#06367C] group-hover:scale-105",
                        )}
                      >
                        <Bus size={18} strokeWidth={2} />
                      </div>

                      {/* Text Info */}
                      <div>
                        <h4
                          className={classNames(
                            "font-bold text-sm tracking-tight",
                            isSelected
                              ? "text-[#06367C]"
                              : "text-gray-900 group-hover:text-[#06367C]",
                          )}
                        >
                          Bus {vehicle.attributes.label}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                            ID: {vehicle.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chevron Indicator */}
                    <ChevronRight
                      size={16}
                      className={classNames(
                        "transition-transform duration-300",
                        isSelected
                          ? "text-[#06367C] translate-x-0"
                          : "text-gray-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0",
                      )}
                    />
                  </div>

                  {/* Bottom Row: Status & Location */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <StatusBadge status={vehicle.attributes.current_status} />

                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-md group-hover:bg-white transition-colors">
                      <Navigation
                        size={10}
                        className={
                          isSelected ? "text-[#06367C]" : "text-gray-400"
                        }
                      />
                      <span
                        className={
                          isSelected ? "text-gray-600 font-medium" : ""
                        }
                      >
                        {vehicle.attributes.latitude.toFixed(3)},{" "}
                        {vehicle.attributes.longitude.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 text-center border-t border-gray-200 bg-white text-[10px] text-gray-400">
        Total {totalVehicles} unit tersedia
      </div>
    </div>
  );
};
