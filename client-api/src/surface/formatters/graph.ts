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
  const edges = new Map<string, Edge>();
  paths.forEach(path => {
    nodes.set(path[0].id, formatCapture(path[0], true));
    if (path[2]) {
      if (!nodes.has(path[2].properties["id"])) {
        nodes.set(path[2].properties["id"], formatNode(path[2]));
      }
      const edge = formatEdge(path[1], path[0].id, path[2].properties["id"]);
      if (!hasEdge(edges, edge)) {
        edges.set(formatEdgeId(edge.source, edge.destination), edge);
      }
    }
    if (path[4]) {
      if (!nodes.has(path[4].id)) {
        nodes.set(path[4].id, formatCapture(path[4], false));
      }
      const edge = formatEdge(path[3], path[2].properties["id"], path[4].id);
      if (!hasEdge(edges, edge)) {
        edges.set(formatEdgeId(edge.source, edge.destination), edge);
      }
    }
  });
  return new Graph(
    Array.from(nodes, ([, value]) => value),
    Array.from(edges, ([, value]) => value)
  );
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

function formatEdgeId(src: string, dest: string): string {
  return `${src};${dest}`;
}

function hasEdge(map, edge): boolean {
  const edgeId = formatEdgeId(edge.source, edge.destination);
  const reverseEdgeId = formatEdgeId(edge.destination, edge.source);
  return map.has(edgeId) || map.has(reverseEdgeId);
}

function formatEdge(rel: Relationship, start: string, end: string): Edge {
  return new Edge({
    source: start,
    destination: end,
    type: rel.type,
    salience: rel.properties["salience"]
  });
}
