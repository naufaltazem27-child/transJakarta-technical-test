import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "../components/layout/MainLayout";
import { FullMap } from "../features/FullMap";
import { LiveMapSidebar } from "../features/LiveMapSidebar";
import { InfiniteFilterDropdown } from "../components/ui/InfiniteFilterDropdown";
import { getVehicles, getRoutes, getTrips } from "../services/vehicleService";
import { useDebounce } from "../hooks/useDebounce";
import type { Vehicle } from "../types/vehicles";
import type { Route } from "../types/route";
import { FilterX, MapPin, Layers } from "lucide-react";
import type { Trip } from "../types/trip";

export const LiveMap = () => {
  // --- STATE ---
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter States
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // --- QUERY DATA ---
  const { data, isLoading } = useQuery({
    queryKey: ["vehicles-map", debouncedSearch, selectedRoutes, selectedTrips],
    queryFn: () =>
      getVehicles({
        limit: 100,
        search: debouncedSearch,
        route: selectedRoutes,
        trip: selectedTrips,
      }),
    refetchInterval: 5000,
    placeholderData: (prev) => prev,
  });

  // Query untuk SEMUA vehicle (tanpa filter) untuk stats total
  const { data: allVehiclesData } = useQuery({
    queryKey: ["vehicles-all-map"],
    queryFn: () =>
      getVehicles({
        limit: 9999,
      }),
    refetchInterval: 10000,
    placeholderData: (prev) => prev,
  });

  const vehicles = data?.data || [];
  const totalVehicles = allVehiclesData?.data.length || 0;

  return (
    <MainLayout>
      <div className="absolute inset-0 flex flex-col md:flex-row overflow-hidden bg-gray-50">
        {/* KIRI: SIDEBAR LIST */}
        <div className="w-full md:w-96 h-[40vh] md:h-full shrink-0 z-20 bg-white shadow-xl">
          <LiveMapSidebar
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onSelect={(v) => {
              setSelectedVehicle(v);
            }}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={isLoading}
            totalVehicles={totalVehicles}
          />
        </div>

        {/* KANAN: FULL SCREEN MAP */}
        <div className="flex-1 h-[60vh] md:h-full relative z-10 bg-gray-100">
          {/* --- FLOATING FILTER BAR --- */}
          <div className="absolute top-5 left-5 right-5 z-[1000] pointer-events-none">
            <div className="flex justify-center md:justify-start">
              <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-2xl shadow-black/10 p-2.5 flex flex-wrap gap-2 items-center max-w-full">
                {/* Header Icon & Title */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl border border-gray-200">
                  <Layers
                    size={18}
                    className="text-gray-700"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:inline">
                    Filter
                  </span>
                </div>

                {/* Filter Rute - FIXED z-index */}
                <div className="w-48 relative z-50">
                  <InfiniteFilterDropdown
                    label="Rute"
                    queryKey={["routes"]}
                    fetchFn={getRoutes}
                    selectedValues={selectedRoutes}
                    onChange={(vals) => {
                      setSelectedRoutes(vals);
                      setSelectedTrips([]);
                    }}
                    mapDataToOption={(item: Route) => ({
                      id: item.id,
                      label: item.attributes.short_name,
                      subLabel: item.attributes.long_name,
                    })}
                  />
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-gradient-to-b from-transparent via-gray-300 to-transparent hidden sm:block"></div>

                {/* Filter Trip - FIXED z-index */}
                <div className="w-48 relative z-40">
                  <div
                    className={
                      selectedRoutes.length === 0
                        ? "opacity-40 pointer-events-none"
                        : ""
                    }
                  >
                    <InfiniteFilterDropdown
                      label="Trip"
                      queryKey={["trips", ...selectedRoutes]}
                      fetchFn={(pageParam) =>
                        getTrips(pageParam, selectedRoutes)
                      }
                      selectedValues={selectedTrips}
                      onChange={setSelectedTrips}
                      mapDataToOption={(item: Trip) => ({
                        id: item.id,
                        label: item.attributes.headsign,
                        subLabel: `ID: ${item.id}`,
                      })}
                    />
                  </div>

                  {/* Tooltip untuk disabled state */}
                  {selectedRoutes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center group cursor-not-allowed z-10">
                      <div className="hidden group-hover:block absolute top-full mt-3 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-xl whitespace-nowrap">
                        Pilih Rute terlebih dahulu
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1.5 w-0 h-0 border-[6px] border-transparent border-b-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Filter Count Badge */}
                {(selectedRoutes.length > 0 || selectedTrips.length > 0) && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-bold text-blue-700">
                      {selectedRoutes.length + selectedTrips.length} Aktif
                    </span>
                  </div>
                )}

                {/* Reset Button */}
                {(selectedRoutes.length > 0 || selectedTrips.length > 0) && (
                  <button
                    onClick={() => {
                      setSelectedRoutes([]);
                      setSelectedTrips([]);
                    }}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 group"
                    title="Reset Semua Filter"
                  >
                    <FilterX
                      size={18}
                      strokeWidth={2.5}
                      className="group-hover:rotate-90 transition-transform duration-300"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Info Card - Bottom Left */}
          {!isLoading && totalVehicles > 0 && (
            <div className="absolute bottom-6 left-5 z-[1000] pointer-events-none">
              <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                    <MapPin
                      size={22}
                      className="text-gray-700"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Total Unit
                    </p>
                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                      {totalVehicles}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && !data && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-[900] flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  {/* Outer ring */}
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                  {/* Middle ring */}
                  <div className="absolute inset-2 bg-blue-400/20 rounded-full animate-ping animation-delay-150"></div>
                  {/* Inner container */}
                  <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-gray-200">
                    <MapPin
                      className="text-[#06367C] animate-bounce"
                      size={40}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <p className="text-[#06367C] font-bold text-xl mb-2">
                  Memuat Peta Satelit
                </p>
                <p className="text-gray-500 text-sm">
                  Menghubungkan ke sistem realtime...
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <div className="w-2 h-2 bg-[#06367C] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#06367C] rounded-full animate-bounce animation-delay-100"></div>
                  <div className="w-2 h-2 bg-[#06367C] rounded-full animate-bounce animation-delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* Map Component */}
          <FullMap
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onSelect={setSelectedVehicle}
          />
        </div>
      </div>
    </MainLayout>
  );
};
