import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  FilterX,
  Search,
  Bus,
  ChevronLeft,
  ChevronRight,
  Map,
  PlayCircle,
  PauseCircle,
  Navigation,
  Compass,
  MapPin,
  TrendingUp,
} from "lucide-react";

// Services & Hooks
import { getVehicles, getRoutes, getTrips } from "../services/vehicleService";
import { useDebounce } from "../hooks/useDebounce";

// Components
import { MainLayout } from "../components/layout/MainLayout";
import { VehicleCard } from "../components/ui/VehicleCard";
import { InfiniteFilterDropdown } from "../components/ui/InfiniteFilterDropdown";
import { Modal } from "../components/ui/Modal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { VehicleMap } from "../features/VehicleMap";

// Types
import type { Route } from "../types/route";
import type { Vehicle } from "../types/vehicles";
import type { Trip } from "../types/trip";

// Helper function to convert bearing to compass direction
const getBearingDirection = (bearing: number): string => {
  const directions = [
    "Utara",
    "Timur Laut",
    "Timur",
    "Tenggara",
    "Selatan",
    "Barat Daya",
    "Barat",
    "Barat Laut",
  ];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

export const Dashboard = () => {
  // --- STATE MANAGEMENT ---
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(8);

  // Filter States
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Debounce Search Term (mencegah request API berlebihan saat mengetik)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Reset halaman ke 0 setiap kali filter berubah agar UX konsisten
  useEffect(() => {
    setPage(0);
  }, [selectedRoutes, selectedTrips, limit, debouncedSearch]);

  // --- DATA FETCHING (TanStack Query) ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "vehicles",
      page,
      limit,
      selectedRoutes,
      selectedTrips,
      debouncedSearch,
    ],
    queryFn: () =>
      getVehicles({
        page,
        limit,
        route: selectedRoutes,
        trip: selectedTrips,
        search: debouncedSearch,
      }),
    refetchInterval: 10000, // Auto-refresh tiap 10 detik
    placeholderData: (previousData) => previousData,
  });

  const { data: allVehiclesData } = useQuery({
    queryKey: ["vehicles-all", selectedRoutes, selectedTrips, debouncedSearch],
    queryFn: () =>
      getVehicles({
        page: 0,
        limit: 9999,
        route: selectedRoutes,
        trip: selectedTrips,
        search: debouncedSearch,
      }),
    refetchInterval: 10000,
    placeholderData: (previousData) => previousData,
  });

  // Calculate status breakdown dari SEMUA data
  const statusBreakdown =
    allVehiclesData?.data.reduce(
      (acc, vehicle) => {
        const status = vehicle.attributes.current_status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ) || {};

  const totalVehicles = allVehiclesData?.data.length || 0;

  return (
    <MainLayout>
      {/* --- HEADER SECTION --- */}
      <div className="mb-8">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Armada Operasional
          </h1>
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </div>
              <span className="text-xs font-semibold text-green-700">
                Realtime Monitoring
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-600 font-medium">
              MBTA Open API
            </span>
          </div>
        </div>

        {/* Stats Overview Section */}
        {!isLoading && !isError && data && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  Status Armada
                </h2>
                <p className="text-xs text-gray-500">
                  Real-time overview berdasarkan status operasional
                </p>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Unit */}
              <div className="group relative bg-gradient-to-br from-[#06367C] via-[#06367C] to-[#0847a0] rounded-2xl p-5 text-white shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Bus size={22} strokeWidth={2.5} className="text-white" />
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-blue-100 uppercase tracking-wider mb-2">
                    Total Unit
                  </p>
                  <p className="text-4xl font-bold tracking-tight">
                    {totalVehicles}
                  </p>
                  <p className="text-xs text-blue-100/70 mt-1">Armada aktif</p>
                </div>
              </div>

              {/* In Transit */}
              <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <Navigation
                      size={22}
                      strokeWidth={2.5}
                      className="text-green-600"
                    />
                  </div>
                  <div className="px-2 py-1 bg-green-50 rounded-lg">
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  In Transit
                </p>
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  {statusBreakdown["IN_TRANSIT_TO"] || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Sedang beroperasi</p>
              </div>

              {/* Stopped At */}
              <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <PauseCircle
                      size={22}
                      strokeWidth={2.5}
                      className="text-red-600"
                    />
                  </div>
                  <div className="px-2 py-1 bg-red-50 rounded-lg">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                      Stopped
                    </span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Stopped At
                </p>
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  {statusBreakdown["STOPPED_AT"] || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Berhenti sementara</p>
              </div>

              {/* Incoming At */}
              <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <PlayCircle
                      size={22}
                      strokeWidth={2.5}
                      className="text-orange-600"
                    />
                  </div>
                  <div className="px-2 py-1 bg-orange-50 rounded-lg">
                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                      Incoming
                    </span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Incoming At
                </p>
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  {statusBreakdown["INCOMING_AT"] || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Menuju halte</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- CONTENT AREA --- */}
      {isLoading && !data ? (
        // STATE: LOADING
        <div className="min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
            <div className="relative bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
              <Loader2
                className="animate-spin text-[#06367C]"
                size={40}
                strokeWidth={2.5}
              />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">
            Memuat data armada...
          </p>
          <p className="mt-1 text-xs text-gray-400">Menghubungkan ke sistem</p>
        </div>
      ) : isError ? (
        // STATE: ERROR
        <div className="min-h-[500px] flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50/30 rounded-2xl border border-red-100 p-8">
          <div className="bg-red-100 p-4 rounded-2xl mb-4 border border-red-200">
            <FilterX size={36} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md text-center">
            {(error as Error).message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30"
          >
            Muat Ulang Halaman
          </button>
        </div>
      ) : (
        <>
          {/* Filter & Search Controls - Selalu tampil */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
              {/* SEARCH INPUT */}
              <div className="relative flex-1 min-w-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari ID Bus"
                  className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06367C]/10 focus:border-[#06367C] text-sm transition-all"
                />
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-gray-200 h-10 mx-1"></div>

              {/* FILTER RUTE */}
              <div className="lg:w-auto">
                <InfiniteFilterDropdown
                  label="Rute"
                  queryKey={["routes"]}
                  fetchFn={getRoutes}
                  selectedValues={selectedRoutes}
                  onChange={(vals) => {
                    setSelectedRoutes(vals);
                    setSelectedTrips([]); // Reset trip saat rute berubah agar data valid
                  }}
                  mapDataToOption={(item: Route) => ({
                    id: item.id,
                    label: item.attributes.short_name,
                    subLabel: item.attributes.long_name,
                  })}
                />
              </div>

              {/* FILTER TRIP (Dependent on Route) */}
              <div className="lg:w-auto relative">
                <div
                  className={
                    selectedRoutes.length === 0
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }
                >
                  <InfiniteFilterDropdown
                    label="Trip"
                    queryKey={["trips", ...selectedRoutes]}
                    fetchFn={(pageParam) => getTrips(pageParam, selectedRoutes)}
                    selectedValues={selectedTrips}
                    onChange={setSelectedTrips}
                    mapDataToOption={(item: Trip) => ({
                      id: item.id,
                      label: item.attributes.headsign,
                      subLabel: `ID: ${item.id}`,
                    })}
                  />
                </div>

                {/* Tooltip UX */}
                {selectedRoutes.length === 0 && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center group cursor-not-allowed">
                    <div className="hidden group-hover:block absolute bottom-full mb-2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                      Pilih Rute terlebih dahulu
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* RESET BUTTON */}
              {(selectedRoutes.length > 0 ||
                selectedTrips.length > 0 ||
                searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedRoutes([]);
                    setSelectedTrips([]);
                    setSearchTerm("");
                    setPage(0);
                  }}
                  className="lg:w-auto px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all border border-red-200 flex items-center justify-center gap-2"
                  title="Reset Semua Filter"
                >
                  <FilterX size={18} />
                  <span className="hidden sm:inline">Reset Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* Conditional Content: Empty State vs Data Grid */}
          {data?.data.length === 0 ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <div className="bg-gray-100 p-5 rounded-2xl mb-4 border border-gray-200">
                <Bus size={48} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Armada Tidak Ditemukan
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md text-center px-4">
                Tidak ada bus yang sesuai dengan filter rute, trip, atau
                pencarian Anda saat ini.
              </p>
              <button
                onClick={() => {
                  setSelectedRoutes([]);
                  setSelectedTrips([]);
                  setSearchTerm("");
                }}
                className="px-5 py-2.5 text-sm text-[#06367C] font-medium hover:bg-blue-50 rounded-lg transition-all border border-blue-200 hover:border-blue-300"
              >
                Bersihkan Filter
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {data?.data.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    data={vehicle}
                    onClick={(v) => setSelectedVehicle(v)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* --- FOOTER: PAGINATION & LIMIT --- */}
          {data?.data && data.data.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Limit Selector (Kiri) */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tampilkan:
                  </span>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-[#06367C]/10 focus:border-[#06367C] block px-3 py-2 font-medium cursor-pointer hover:border-gray-300 transition-all"
                  >
                    <option value={8}>8 Unit</option>
                    <option value={12}>12 Unit</option>
                    <option value={24}>24 Unit</option>
                    <option value={48}>48 Unit</option>
                  </select>
                </div>

                {/* Pagination Controls (Kanan) */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 hidden sm:block">
                    Halaman{" "}
                    <span className="font-bold text-[#06367C]">{page + 1}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    Data {page * limit + 1} -{" "}
                    {page * limit + (data?.data.length || 0)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all border border-gray-200 disabled:border-gray-100"
                      title="Halaman Sebelumnya"
                    >
                      <ChevronLeft size={20} strokeWidth={2} />
                    </button>
                    <button
                      disabled={!data?.data.length || data.data.length < limit}
                      onClick={() => setPage((p) => p + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#06367C] text-white hover:bg-[#052c65] disabled:opacity-40 disabled:hover:bg-[#06367C] transition-all shadow-sm hover:shadow-md disabled:shadow-none"
                      title="Halaman Selanjutnya"
                    >
                      <ChevronRight size={20} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- DETAIL MODAL --- */}
      <Modal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title={`Detail Armada: ${selectedVehicle?.attributes.label || "N/A"}`}
      >
        {selectedVehicle && (
          <div className="flex flex-col lg:flex-row h-auto lg:h-[450px] overflow-hidden">
            {/* LEFT SIDE: INFORMATION */}
            <div className="w-full lg:w-[35%] p-6 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-gray-100 bg-white relative z-10 overflow-y-auto lg:max-h-[450px]">
              {/* Vehicle ID Badge */}
              <div className="bg-gradient-to-r from-[#06367C] to-[#0847a0] rounded-lg px-3 py-2 -mt-2">
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">
                  Vehicle ID
                </p>
                <p className="font-mono text-sm font-bold text-white">
                  {selectedVehicle.id}
                </p>
              </div>

              {/* Status Section (Hero) */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  Status Terkini
                </label>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={selectedVehicle.attributes.current_status}
                  />
                  <span className="text-xs text-gray-400 font-medium">
                    • Updated{" "}
                    {new Date(
                      selectedVehicle.attributes.updated_at,
                    ).toLocaleTimeString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100"></div>

              {/* Route Info */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-blue-50 rounded-md text-[#06367C]">
                      <Bus size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Rute Operasional
                    </span>
                  </div>
                  <div className="pl-8">
                    <p className="text-lg font-bold text-gray-900">
                      {selectedVehicle.relationships.route.data?.id || "-"}
                    </p>
                    <p className="text-xs text-gray-500">Rute ID Active</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-purple-50 rounded-md text-purple-700">
                      <Navigation size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Perjalanan (Trip)
                    </span>
                  </div>
                  <div className="pl-8">
                    <p className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">
                      {selectedVehicle.relationships.trip.data?.id || "-"}
                    </p>
                  </div>
                </div>

                {/* Stop Information */}
                {selectedVehicle.relationships.stop.data && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-amber-50 rounded-md text-amber-700">
                        <MapPin size={14} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Halte/Stop
                      </span>
                    </div>
                    <div className="pl-8">
                      <p className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">
                        {selectedVehicle.relationships.stop.data.id}
                      </p>
                    </div>
                  </div>
                )}

                {/* Stop Sequence & Bearing */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Current Stop Sequence */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-teal-50 rounded-md text-teal-700">
                        <TrendingUp size={14} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Urutan
                      </span>
                    </div>
                    <div className="pl-8">
                      <p className="text-lg font-bold text-gray-900">
                        #{selectedVehicle.attributes.current_stop_sequence}
                      </p>
                      <p className="text-xs text-gray-500">Stop ke-</p>
                    </div>
                  </div>

                  {/* Bearing/Direction */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-700">
                        <Compass size={14} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Arah
                      </span>
                    </div>
                    <div className="pl-8">
                      <p className="text-lg font-bold text-gray-900">
                        {selectedVehicle.attributes.bearing}°
                      </p>
                      <p className="text-xs text-gray-500">
                        {getBearingDirection(
                          selectedVehicle.attributes.bearing,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coordinate Snippet (Footer Info) */}
              <div className="pt-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-mono mb-1">
                    GPS COORDINATES
                  </p>
                  <div className="flex justify-between items-center text-xs font-medium text-gray-600">
                    <span>
                      Lat: {selectedVehicle.attributes.latitude.toFixed(5)}
                    </span>
                    <span>
                      Lng: {selectedVehicle.attributes.longitude.toFixed(5)}
                    </span>
                  </div>
                </div>

                {/* Visual Compass Indicator */}
                <div className="mt-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-3 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-indigo-600 font-bold mb-1 uppercase tracking-wider">
                        Kompas Digital
                      </p>
                      <p className="text-sm font-bold text-indigo-900">
                        {getBearingDirection(
                          selectedVehicle.attributes.bearing,
                        )}
                      </p>
                    </div>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div
                        className="absolute w-full h-full flex items-center justify-center transition-transform duration-500"
                        style={{
                          transform: `rotate(${selectedVehicle.attributes.bearing}deg)`,
                        }}
                      >
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[20px] border-b-indigo-600"></div>
                      </div>
                      <div className="absolute w-10 h-10 rounded-full border-2 border-indigo-300 bg-white/50"></div>
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: INTERACTIVE MAP (65%) */}
            <div className="w-full lg:w-[65%] relative group bg-slate-50">
              {/* Map Component */}
              <div className="absolute inset-0 z-0">
                <VehicleMap
                  latitude={selectedVehicle.attributes.latitude}
                  longitude={selectedVehicle.attributes.longitude}
                  label={selectedVehicle.attributes.label}
                />
              </div>

              {/* HOVER OVERLAY CTA */}
              <a
                href="/map"
                className="absolute inset-0 z-10 bg-[#06367C]/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  <Map size={32} className="text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  Buka Peta Langsung
                </span>
                <span className="text-blue-100 text-sm mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                  Lihat posisi armada di peta fullscreen
                </span>
              </a>

              {/* Floating Badge (Visual Only) */}
              <div className="absolute top-4 right-4 z-0 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-bold text-gray-600 group-hover:opacity-0 transition-opacity">
                Live Map View
              </div>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};
