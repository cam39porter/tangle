import * as _ from "lodash";
import * as moment from "moment";
import { executeQuery } from "../db/db";
import { Session } from "../db/models/session";
import { archiveCaptureNode } from "../db/services/capture";
import { create as createSession } from "../db/services/session";
import { getUrnType } from "../helpers/urn-helpers";
import { Edge } from "../surface/models/edge";
import { Graph } from "../surface/models/graph";
import { GraphNode } from "../surface/models/graph-node";
import { PageInfo } from "../surface/models/page-info";
import { SearchResults } from "../surface/models/search-results";
import { createCapture, editCapture } from "../capture/services/capture";
import { getAuthenticatedUser } from "../filters/request-context";

export default {
  Query: {
    search(
      // @ts-ignore
      parent,
      { rawQuery, start, count },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SearchResults> {
      return search(rawQuery, start, count);
    },
    // @ts-ignore
    get(parent, { id }, context, info): Promise<Graph> {
      return get(id);
    },
    getAll(
      // @ts-ignore
      parent,
      { useCase, timezoneOffset },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SearchResults> {
      if (useCase === "CAPTURED_TODAY") {
        return getAllCapturedToday(timezoneOffset);
      } else if (useCase === "ALL") {
        return getAll();
      } else {
        return getAll();
      }
    }
  },
  Mutation: {
    // @ts-ignore
    archiveCapture(parent, { id }, context, info): Promise<boolean> {
      const userId: string = getAuthenticatedUser().id;
      return archiveCaptureNode(userId, id).then(() => true);
    },
    // @ts-ignore
    editCapture(parent, { id, body }, context, info): Promise<boolean> {
      return editCapture(id, body);
    },
    // @ts-ignore
    createCapture(parent, { body, sessionId }, context, info): Promise<Graph> {
      return createCapture(body, sessionId).then(() =>
        getAllCapturedToday(null).then(results => results.graph)
      );
    },
    // @ts-ignore
    createSession(parent, { title }, context, info): Promise<GraphNode> {
      const userId = getAuthenticatedUser().id;
      return createSession(userId, title).then((session: Session) => {
        return new GraphNode(session.id, "Session", session.title, null);
      });
    }
  }
};

/**
 * Generates a piece of a cypher query that will expand a set of captures,
 * called "roots" to their second degree connections
 * @param userUrn the id of the user requesting
 * @returns two collections in cypher, called "nodes", and "relationship". The caller is responsible for returning these
 */
function expandCaptures(userUrn: string): string {
  return `OPTIONAL MATCH (roots:Capture)-[r1]-(firstDegree)
  WHERE firstDegree:Tag OR firstDegree:Entity OR firstDegree:Session OR firstDegree:Link
  OPTIONAL MATCH (firstDegree)-[r2]-(secondDegree:Capture)<-[:CREATED]-(u:User {id:"${userUrn}"})
  WHERE NOT EXISTS(secondDegree.archived) or secondDegree.archived = false
  WITH roots, collect(roots)+collect(firstDegree)+collect(secondDegree) AS nodes,
  collect(distinct r1)+collect(distinct r2) AS relationships
  UNWIND nodes as node
  UNWIND relationships as rel
  WITH collect(distinct roots) as roots, collect(distinct node) as nodes, collect(distinct rel) as relationships
  `;
}

function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  if (!rawQuery || rawQuery.length === 0) {
    return getAllRandomCapture();
  } else {
    return executeQuery(`CALL apoc.index.search("captures", "${rawQuery}~") YIELD node as c, weight
    MATCH (c:Capture)<-[created:CREATED]-(u:User {id:"${userId}"})
    WHERE NOT EXISTS (c.archived) OR c.archived = false
    WITH c as roots, weight
    SKIP ${start} LIMIT ${count}
    ${expandCaptures(userId)}
    RETURN roots, nodes, relationships
`).then(res => {
      return new SearchResults(
        buildGraph(
          res.records[0].get("nodes"),
          res.records[0].get("relationships"),
          null,
          res.records[0].get("roots")
        ),
        new PageInfo(start, count, start + count)
      );
    });
  }
}

function getAllRandomCapture(): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  return executeQuery(
    `MATCH (roots:Capture)<-[created:CREATED]-(user:User {id:"${userId}"})
    WHERE NOT EXISTS (roots.archived) OR roots.archived = false
    WITH roots, rand() as number
    ORDER BY number
    LIMIT 1
    ${expandCaptures(userId)}
    RETURN roots, nodes, relationships
    `
  ).then(res => {
    return new SearchResults(
      buildGraph(
        res.records[0].get("nodes"),
        res.records[0].get("relationships"),
        null,
        res.records[0].get("roots")
      ),
      new PageInfo(
        0,
        res.records[0].get("nodes").length,
        res.records[0].get("nodes").length
      )
    );
  });
}

function getAll() {
  const userId = getAuthenticatedUser().id;
  return executeQuery(`MATCH (roots:Capture)<-[created:CREATED]-(user:User {id:"${userId}"})
  WITH roots
  ORDER BY roots.created DESC
  LIMIT 50
  ${expandCaptures(userId)}
  RETURN roots, nodes, relationships
  `).then(res => {
    return new SearchResults(
      buildGraph(
        res.records[0].get("nodes"),
        res.records[0].get("relationships"),
        null,
        res.records[0].get("roots")
      ),
      new PageInfo(
        0,
        res.records[0].get("nodes").length,
        res.records[0].get("nodes").length
      )
    );
  });
}

function getAllCapturedToday(timezoneOffset: number): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  const since = getCreatedSince(timezoneOffset).unix() * 1000;

  return executeQuery(
    `MATCH (roots:Capture)<-[created:CREATED]-(user:User {id:"${userId}"})
    WHERE roots.created > ${since} AND NOT EXISTS (roots.archived)
    WITH roots
    ORDER BY roots.created DESC
    LIMIT 50
    ${expandCaptures(userId)}
    RETURN roots, nodes, relationships
    `
  ).then(res => {
    return new SearchResults(
      buildGraph(
        res.records[0].get("nodes"),
        res.records[0].get("relationships"),
        null,
        res.records[0].get("roots")
      ),
      new PageInfo(
        0,
        res.records[0].get("nodes").length,
        res.records[0].get("nodes").length
      )
    );
  });
}

function getCreatedSince(timezoneOffset: number) {
  return moment
    .utc()
    .add(timezoneOffset ? moment.duration(timezoneOffset, "hours") : 0)
    .startOf("day")
    .subtract(timezoneOffset ? moment.duration(timezoneOffset, "hours") : 0);
}

function get(urn: string): Promise<Graph> {
  if (getUrnType(urn) === "capture") {
    return getCapture(urn);
  } else {
    return getOthers(urn);
  }
}

function getOthers(urn: string) {
  const userUrn = getAuthenticatedUser().id;
  return executeQuery(`MATCH (other {id:"${urn}"})-[r]-(roots:Capture)<-[:CREATED]-(u:User {id:"${userUrn}"})
  WHERE NOT EXISTS(roots.archived) OR roots.archived = false
  ${expandCaptures(userUrn)}
  RETURN roots, nodes, relationships
  `).then(res => {
    return buildGraph(
      res.records[0].get("nodes"),
      res.records[0].get("relationships"),
      urn,
      res.records[0].get("roots")
    );
  });
}

function getCapture(urn: string) {
  const userUrn = getAuthenticatedUser().id;
  return executeQuery(`MATCH (roots:Capture {id:"${urn}"})
  ${expandCaptures(userUrn)}
  RETURN roots, nodes, relationships
  `).then(res => {
    return buildGraph(
      res.records[0].get("nodes"),
      res.records[0].get("relationships"),
      urn,
      res.records[0].get("roots")
    );
  });
}
function buildGraph(
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
          node.properties.url,
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
