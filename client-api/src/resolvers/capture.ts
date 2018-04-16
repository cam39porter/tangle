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
  createTagNodeWithEdge
} from "../db/db";
import { parseTags, stripTags } from "../helpers/tag";
import * as _ from "lodash";
import * as moment from "moment";
import { getAuthenticatedUser } from "../services/request-context";
import { toEntityUrn, toUserUrn } from "../helpers/urn-helpers";

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
      return getAll(timezoneOffset);
    }
  },
  Mutation: {
    createCapture(
      parent,
      { body, timezoneOffset },
      context,
      info
    ): Promise<Graph> {
      const user: User = getAuthenticatedUser();
      return createCaptureNode(user, body).then((captureNode: GraphNode) => {
        return getNLPResponse(stripTags(body)).then(nlp => {
          const nlpCreates = Promise.all(
            nlp.entities.map(entity =>
              insertEntityWithRel(captureNode.id, entity)
            )
          );
          return nlpCreates.then(nlpCreateResults => {
            const tagCreates = Promise.all(
              parseTags(body).map(tag =>
                createTagNodeWithEdge(tag, captureNode.id)
              )
            );
            return tagCreates.then(tagCreateResults => {
              return getAll(timezoneOffset).then(
                searchResults => searchResults.graph
              );
            });
          });
        });
      });
    }
  }
};

function insertEntityWithRel(
  captureUrn: string,
  entity: NLPEntity
): Promise<any> {
  const urn = toEntityUrn(`${entity.name};${entity.type}`);
  return executeQuery(`
    MATCH (capture {id: "${captureUrn}"})
    MERGE (entity:Entity {
      id: "${urn}",
      name: "${entity.name}",
      type: "${entity.type}"
    })
    CREATE (entity)<-[r:REFERENCES { salience: ${entity.salience} }]-(capture)
    RETURN entity
  `);
}

function getAll(timezoneOffset: number): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  const since = getCreatedSince(timezoneOffset).unix() * 1000;
  return executeQuery(
    `MATCH (capture:Capture)<-[created:CREATED]-(user:User {id:"${userId}"})
    WHERE capture.created > ${since}
    WITH capture 
    ORDER BY capture.created DESC
    LIMIT 50
    OPTIONAL MATCH (capture)-[r]->(other)
    WITH collect(distinct capture) + collect(distinct other) as nodes, collect(r) as relationships
    RETURN nodes, relationships
    `
  ).then(res => {
    return new SearchResults(
      buildGraph(
        res.records[0].get("nodes"),
        res.records[0].get("relationships"),
        null
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
    .startOf("day");
}

function get(urn: string): Promise<Graph> {
  const userUrn = getAuthenticatedUser().id;
  return executeQuery(`MATCH (node {id:"${urn}"}) 
  CALL apoc.path.subgraphAll(node, {maxLevel:2, labelFilter:"-User"}) yield nodes, relationships
  WITH nodes, relationships
  UNWIND nodes AS n
  MATCH (u:User {id:"${userUrn}"})
  WHERE n:Tag OR n:Entity OR (n:Capture)<-[:CREATED]-(u)
  RETURN collect(distinct n) AS nodes, relationships`).then(res => {
    return buildGraph(
      res.records[0].get("nodes"),
      res.records[0].get("relationships"),
      urn
    );
  });
}

function buildGraph(
  neoNodes: any,
  neoRelationships: any,
  startUrn: string
): Graph {
  const neoIdToNodeId = _.mapValues(
    _.keyBy(neoNodes, "identity"),
    "properties.id"
  );

  const rootNodeType: string = neoNodes
    .filter(node => node.properties.id === startUrn)
    .map(node => node.labels[0])[0];

  const filteredRel = neoRelationships.filter(
    edge => neoIdToNodeId[edge.start] && neoIdToNodeId[edge.end]
  );

  const nodeIdsWithRel = [].concat(
    ...filteredRel.map(rel => [
      neoIdToNodeId[rel.start],
      neoIdToNodeId[rel.end]
    ])
  );

  const filteredNodes = neoNodes.filter(node =>
    nodeIdsWithRel.includes(node.properties.id)
  );

  const nodes: GraphNode[] = filteredNodes.map(
    node =>
      new GraphNode(
        node.properties.id,
        node.labels[0],
        node.properties.body || node.properties.name,
        getLevel(startUrn, rootNodeType, node.properties.id, node.labels[0])
      )
  );
  const edges: Edge[] = filteredRel.map(
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

function getLevel(
  startId: string,
  startType: string,
  nodeId: string,
  nodeType: string
): number {
  // getAll
  if (startId === null) {
    if (nodeType === "Capture") {
      return 0;
    } else {
      return 1;
    }
    // get
  } else if (startId === nodeId) {
    return 0;
  } else if (startType === "Capture") {
    if (nodeType === "Capture") {
      return 2;
    } else {
      return 1;
    }
    // startType != Capture
  } else {
    if (nodeType === "Capture") {
      return 1;
    } else {
      return 2;
    }
  }
}

function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  const cypherQuery =
    rawQuery && rawQuery.length > 0
      ? `CALL apoc.index.search("captures", "${rawQuery}~") YIELD node as c, weight
      MATCH (c:Capture)<-[created:CREATED]-(u:User {id:"${userId}"})
      WITH c, weight
      SKIP ${start} LIMIT ${count}
      OPTIONAL MATCH (c)-[r]->(n)
      WITH collect(distinct c) + collect(distinct n) as nodes, collect(r) as relationships
      RETURN nodes, relationships`
      : `MATCH (c:Capture)<-[created:CREATED]-(u:User {id:"${userId}"})
      WITH c
      SKIP ${start} LIMIT ${count}
      OPTIONAL MATCH (c)-[r]->(n)
      WITH collect(distinct c) + collect(distinct n) as nodes, collect(r) as relationships
      RETURN nodes, relationships`;
  return executeQuery(cypherQuery).then(res => {
    return new SearchResults(
      buildGraph(
        res.records[0].get("nodes"),
        res.records[0].get("relationships"),
        null
      ),
      new PageInfo(start, count, start + count)
    );
  });
}
