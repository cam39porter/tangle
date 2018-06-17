// Generic
export type id = string;

// eCharts
export interface GraphNode {
  id: string;
  name: string;
  category: string;
}

export interface GraphEdge {
  source: string;
  destination: string;
}

export interface GraphEvent {
  dataType: string;
  data: { id: string; category: string; name: string };
}

// Location
export enum Location {
  Query,
  Capture,
  None
}
