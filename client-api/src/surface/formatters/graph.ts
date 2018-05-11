import * as _ from "lodash";
import { Edge } from "../models/edge";
import { Graph } from "../models/graph";
import { GraphNode } from "../models/graph-node";
import { Capture } from "../../db/models/capture";
import { Node, Relationship } from "neo4j-driver/types/v1";

export function buildGraph(
  neoNodes: Node[],
  neoRelationships: Relationship[],
  startUrn: string,
  neoRoots: Capture[]
): Graph {
  const neoIdToNodeId = _.mapValues(
    _.keyBy(neoNodes, "identity"),
    "properties.id"
  );

  const captureRoots = neoRoots.map(capture => capture.id);
  if (startUrn) {
    captureRoots.push(startUrn);
  }

  const nodes: GraphNode[] = neoNodes.map(
    node =>
      new GraphNode(
        node.properties["id"],
        node.labels[0],
        node.properties["body"] ||
          node.properties["name"] ||
          node.properties["title"] ||
          node.properties["url"] ||
          "Untitled",
        getLevel(captureRoots, node.properties["id"])
      )
  );
  const edges: Edge[] = neoRelationships.map(
    edge =>
      new Edge({
        source: neoIdToNodeId[edge.start],
        destination: neoIdToNodeId[edge.end],
        type: edge.type,
        salience: edge.properties["salience"]
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
