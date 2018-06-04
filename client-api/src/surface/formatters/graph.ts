import { Edge } from "../models/edge";
import { Graph } from "../models/graph";
import { GraphNode } from "../models/graph-node";
import { Capture } from "../../db/models/capture";
import { Node, Relationship } from "neo4j-driver/types/v1";
import { CAPTURE_LABEL } from "../../db/helpers/labels";

export function buildGraph(
  paths: Array<[Capture, Relationship, Node, Relationship, Capture]>
): Graph {
  const nodes = new Map<string, GraphNode>();
  const edges = [];
  paths.forEach(path => {
    nodes.set(path[0].id, formatCapture(path[0], true));
    if (path[2]) {
      nodes.set(path[2].properties["id"], formatNode(path[2]));
      edges.push(formatEdge(path[1], path[0].id, path[2].properties["id"]));
    }
    if (path[4]) {
      nodes.set(path[4].id, formatCapture(path[4], false));
      edges.push(formatEdge(path[3], path[2].properties["id"], path[4].id));
    }
  });
  return new Graph(Array.from(nodes, ([, value]) => value), edges);
}

function formatNode(node: Node): GraphNode {
  return new GraphNode(
    node.properties["id"],
    node.labels[0],
    node.properties["body"] ||
      node.properties["name"] ||
      node.properties["title"] ||
      node.properties["url"] ||
      "Untitled",
    1
  );
}

function formatCapture(capture: Capture, isRoot: boolean): GraphNode {
  return new GraphNode(
    capture.id,
    CAPTURE_LABEL.name,
    capture.body,
    isRoot ? 0 : 1
  );
}

function formatEdge(rel: Relationship, start: string, end: string): Edge {
  return new Edge({
    source: start,
    destination: end,
    type: rel.type,
    salience: rel.properties["salience"]
  });
}
