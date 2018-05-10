import tinygradient from "tinygradient";

import * as firebase from "firebase";

import config from "../cfg";

import { Node, Edge, id } from "../types";

// Colors
export function getGradient(
  startColor: string,
  endColor: string,
  gradientNumber: number
) {
  return tinygradient(startColor, endColor).rgb(gradientNumber);
}

// Firebase
firebase.initializeApp(config.firebase);

export const firebaseAuth = firebase.auth;

// Graph
export function getEdgeId(edge): id {
  return edge.source + edge.destination;
}

export function constructNodeMap(nodes: Array<Node>): Map<id, Node> {
  let nodeMap = new Map<id, Node>();
  nodes.forEach(node => nodeMap.set(node.id, node));
  return nodeMap;
}

export function constructEdgeMap(edges: Array<Edge>): Map<id, Edge> {
  let edgeMap = new Map<id, Edge>();
  edges.forEach(edge => edgeMap.set(getEdgeId(edge), edge));
  return edgeMap;
}

export function doesEdgeContainNode(edge: Edge, node: Node): boolean {
  return edge.source === node.id || edge.destination === node.id;
}

export function getEdgesOtherNodeId(edge: Edge, node: Node): id {
  return edge.source === node.id ? edge.destination : edge.source;
}

export function getNodesAdjacentToNode(
  node: Node,
  edges: Array<Edge>
): Array<id> {
  return edges
    .filter(edge => doesEdgeContainNode(edge, node))
    .map(edge => getEdgesOtherNodeId(edge, node));
}
