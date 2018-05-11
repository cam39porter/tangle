import * as generatedTypes from "../__generated__/types";

export type id = string;

export interface Node {
  id: id;
  type: generatedTypes.NodeType;
  text: string;
  level: number;
}

export interface Edge {
  source: id;
  destination: id;
  type: generatedTypes.EdgeType;
  salience: number | null;
}

export type ListData = Array<{
  id: id;
  contains: Array<string>;
  related: Array<id>;
}>;

export const graphqlTypes = generatedTypes.NodeType;
