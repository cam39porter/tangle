import {
  PageInfo,
  NLPEntityResponse,
  SearchResults,
  Graph,
  GraphNode,
  Edge,
  NLPEntity,
  User
} from "../models";
import { getNLPResponse } from "../services/nlp";
import {
  executeQuery,
  createCaptureNode,
  createTagNodeWithEdge,
  createEntityNodeWithEdge,
  archiveCaptureNode,
  editCaptureNode
} from "../db/db";
import { parseTags, stripTags } from "../helpers/tag";
import * as _ from "lodash";
import * as moment from "moment";
import { getAuthenticatedUser } from "../services/request-context";
import { toEntityUrn, toUserUrn, getUrnType } from "../helpers/urn-helpers";

const dedupe = require("dedupe");

export default {
  Query: {
    search(
      parent,
      { rawQuery, start, count },
      context,
      info
    ): Promise<SearchResults> {
      return search(rawQuery, start, count);
    },
    get(parent, { id }, context, info): Promise<Graph> {
      return get(id);
    },
    getAll(
      parent,
      { useCase, timezoneOffset },
      context,
      info
    ): Promise<SearchResults> {
      return getAllCapturedToday(timezoneOffset);
    }
  },
  Mutation: {
    archiveCapture(parent, { id }, context, info): Promise<boolean> {
      const userId: string = getAuthenticatedUser().id;
      return archiveCaptureNode(userId, id).then(() => true);
    },
    editCapture(parent, { id, body }, context, info): Promise<boolean> {
      const userId = getAuthenticatedUser().id;
      return editCaptureNode(userId, id, body).then(() =>
        createRelations(id, body)
      );
    },
    createCapture(parent, { body }, context, info): Promise<Graph> {
      const user: User = getAuthenticatedUser();
      return createCaptureNode(user, body).then((captureNode: GraphNode) =>
        createRelations(captureNode.id, body).then(() =>
          getAllCapturedToday(null).then(results => results.graph)
        )
      );
    }
  }
};

function createRelations(captureId: string, body: string): Promise<boolean> {
  return getNLPResponse(stripTags(body)).then(nlp => {
    const nlpCreates = Promise.all(
      nlp.entities.map(entity => createEntityNodeWithEdge(captureId, entity))
    );
    return nlpCreates.then(nlpCreateResults => {
      const tagCreates = Promise.all(
        parseTags(body).map(tag => createTagNodeWithEdge(tag, captureId))
      );
      return tagCreates.then(tagCreateResults => {
        return true;
      });
    });
  });
}

/**
 * Generates a piece of a cypher query that will expand a set of captures, called "roots" to their second degree connections
 * @param userUrn the id of the user requesting
 * @returns two collections in cypher, called "nodes", and "relationship". The caller is responsible for returning these
 */
function expandCaptures(userUrn: string): string {
  return `OPTIONAL MATCH (roots:Capture)-[r1]-(firstDegree) 
  WHERE NOT firstDegree:User
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
function getAllCapturedToday(timezoneOffset: number): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  const since = getCreatedSince(timezoneOffset).unix() * 1000;

  return executeQuery(
    `MATCH (roots:Capture)<-[created:CREATED]-(user:User {id:"${userId}"})
    WHERE roots.created > ${since}
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

  let rootNodes = neoRoots.map(node => node.properties.id);
  if (startUrn) {
    rootNodes.push(startUrn);
  }

  const nodes: GraphNode[] = neoNodes.map(
    node =>
      new GraphNode(
        node.properties.id,
        node.labels[0],
        node.properties.body || node.properties.name,
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
