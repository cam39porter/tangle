import { NodeType } from "../__generated__/types";

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
  data: { id: string; category: NodeType; name: string; level: number };
}

// Location
export enum Location {
  Query,
  Capture,
  None
}
