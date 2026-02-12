import type { Route } from "../types/route";
import type { Trip } from "../types/trip";
import type { MbtaResponse, Vehicle } from "../types/vehicles";
import { apiClient } from "./api";

interface GetVehicleParams {
  page?: number;
  limit?: number;
  route?: string[];
  trip?: string[];
  search?: string;
}

export const getVehicles = async (params: GetVehicleParams) => {
  // const offset = (params.page && params.limit) ? (params.page - 1) * params.limit : undefined;

  const offset = (params.page || 0) * (params.limit || 10);

  const queryParams = new URLSearchParams();

  queryParams.append("page[offset]", offset.toString());
  queryParams.append("page[limit]", (params.limit || 10).toString());

  if (params.route && params.route.length > 0) {
    queryParams.append("filter[route]", params.route.join(","));
  }

  if (params.trip && params.trip.length > 0) {
    queryParams.append("filter[trip]", params.trip.join(","));
  }

  if (params.search) {
    queryParams.append("filter[label]", params.search);
  }

  const response = await apiClient.get<MbtaResponse<Vehicle>>(
    `/vehicles?${queryParams.toString()}`,
  );
  return response.data;
};

interface MbtaRouteResponse {
  data: Route[];
  links?: { next?: string };
}

export const getRoutes = async (pageParam: number = 0) => {
  const limit = 20;
  const offset = pageParam * limit;

  // filter type=3 (Bus) karena MBTA ada kereta juga
  const response = await apiClient.get<MbtaRouteResponse>(
    `/routes?filter[type]=3&page[limit]=${limit}&page[offset]=${offset}`,
  );

  return {
    data: response.data.data,
    nextCursor: response.data.data.length === limit ? pageParam + 1 : undefined,
  };
};

interface MbtaTripResponse {
  data: Trip[];
  links?: { next?: string };
}

export const getTrips = async (
  pageParam: number = 0,
  routeFilter: string[] = [],
) => {
  const limit = 20;
  const offset = pageParam * limit;

  let url = `/trips?page[limit]=${limit}&page[offset]=${offset}`;

  // Jika user sudah milih Rute, kita filter Trip-nya biar relevan
  if (routeFilter.length > 0) {
    url += `&filter[route]=${routeFilter.join(",")}`;
  } else {
    // FIX: Jika rute kosong, Default ambil semua trip BUS (type 3)
    url += `&filter[route_type]=3`;
  }

  const response = await apiClient.get<MbtaTripResponse>(url);

  return {
    data: response.data.data,
    nextCursor: response.data.data.length === limit ? pageParam + 1 : undefined,
  };
};
