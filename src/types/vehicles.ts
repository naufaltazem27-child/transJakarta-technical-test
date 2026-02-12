// Struktur Respon MBTA Umum
export interface MbtaResponse<T> {
  data: T[];
  links?: {
    next?: string;
    prev?: string;
    first?: string;
    last?: string;
  };
}

// Atribut Kendaraan
export interface VehicleAttributes {
  label: string;
  current_status: "IN_TRANSIT_TO" | "STOPPED_AT" | "INCOMING_AT";
  latitude: number;
  longitude: number;
  bearing: number;
  current_stop_sequence: number;
  updated_at: string;
}

// Relasi ke Rute dan Trip
export interface VehicleRelationships {
  route: {
    data: {
      id: string;
      type: "route";
    } | null;
  };
  trip: {
    data: {
      id: string;
      type: "trip";
    } | null;
  };
  stop: {
    data: {
      id: string;
      type: "stop";
    } | null;
  };
}

// Object Kendaraan Utuh
export interface Vehicle {
  id: string;
  type: "vehicle";
  attributes: VehicleAttributes;
  relationships: VehicleRelationships;
}
