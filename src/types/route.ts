export interface RouteAttributes {
  long_name: string;
  short_name: string;
  type: number;
  description: string;
  color: string;
  text_color: string;
}

export interface Route {
  id: string;
  type: "route";
  attributes: RouteAttributes;
}
