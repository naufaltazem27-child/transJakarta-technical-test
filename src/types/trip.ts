export interface Trip {
  id: string;
  type: "trip";
  attributes: {
    name: string;
    headsign: string;
  };
}
