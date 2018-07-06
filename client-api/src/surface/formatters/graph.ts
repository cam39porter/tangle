import { Edge } from "../models/edge";
import { Graph } from "../models/graph";
import { GraphNode } from "../models/graph-node";
import { Capture } from "../../db/models/capture";
import { Node, Relationship } from "neo4j-driver/types/v1";
import { formatNode, formatCapture } from "./graph-node";
import { Session } from "../../db/models/session";

export function buildGraph(
  paths: Array<
    [Capture, Session[], Relationship, Node, Relationship, Capture, Session[]]
  >
): Graph {
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, Edge>();
  paths.forEach(path => {
    const root = path[0];
    const rootParents = path[1];
    const r1 = path[2];
    const firstDegree = path[3];
    const r2 = path[4];
    const secondDegree = path[5];
    const secondDegreeParents = path[6];
    nodes.set(root.urn.getId(), formatCapture(root, rootParents));
    if (firstDegree) {
      if (!nodes.has(firstDegree.properties["id"])) {
        nodes.set(firstDegree.properties["id"], formatNode(firstDegree));
      }
      const edge = formatEdge(
        r1,
        root.urn.toRaw(),
        firstDegree.properties["id"]
      );
      if (!hasEdge(edges, edge)) {
        edges.set(formatEdgeId(edge.source, edge.destination), edge);
      }
    }
    if (secondDegree) {
      if (!nodes.has(secondDegree.urn.getId())) {
        nodes.set(
          secondDegree.urn.getId(),
          formatCapture(secondDegree, secondDegreeParents)
        );
      }
      const edge = formatEdge(
        r2,
        firstDegree.properties["id"],
        secondDegree.urn.toRaw()
      );
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
