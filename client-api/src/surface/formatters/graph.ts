import * as _ from "lodash";
import { Edge } from "../models/edge";
import { Graph } from "../models/graph";
import { GraphNode } from "../models/graph-node";

export function buildGraph(
  neoNodes: any,
  neoRelationships: any,
  startUrn: string,
  neoRoots: any
): Graph {
  const neoIdToNodeId = _.mapValues(
    _.keyBy(neoNodes, "identity"),
    "properties.id"
  );

  const rootNodes = neoRoots.map(node => node.properties.id);
  if (startUrn) {
    rootNodes.push(startUrn);
  }

  const nodes: GraphNode[] = neoNodes.map(
    node =>
      new GraphNode(
        node.properties.id,
        node.labels[0],
        node.properties.body ||
          node.properties.name ||
          node.properties.title ||
          node.properties.url ||
          "Untitled",
        getLevel(rootNodes, node.properties.id)
      )
  );
  const edges: Edge[] = neoRelationships.map(
    edge =>
      new Edge({
        source: neoIdToNodeId[edge.start],
        destination: neoIdToNodeId[edge.end],
        type: edge.type,
        salience: edge.properties.salience
      })
  );
  return new Graph(nodes, edges);
}

function getLevel(rootIds, id): number {
  if (rootIds.includes(id)) {
    return 0;
  } else {
    return 1;
  }
}
