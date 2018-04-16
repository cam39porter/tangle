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
    `MATCH (c:Capture)<-[created:CREATED]-(u:User {id:"${userId}"})
    WHERE c.created > ${since}
    WITH c 
    ORDER BY c.created DESC
    LIMIT 50
    OPTIONAL MATCH (c)-[r]->(n)
    RETURN c,r,n
    `
  ).then(res => {
    return buildSearchResults(res.records, 0, 20);
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
  RETURN collect(distinct n) AS nodes,relationships`).then(res => {
    const neoIdToNodeId = _.mapValues(
      _.keyBy(res.records[0].get("nodes"), "identity"),
      "properties.id"
    );

    const rootNodeType: string = res.records[0]
      .get("nodes")
      .filter(node => node.properties.id === urn)
      .map(node => node.labels[0])[0];

    const nodes: GraphNode[] = res.records[0]
      .get("nodes")
      .map(
        node =>
          new GraphNode(
            node.properties.id,
            node.labels[0],
            node.properties.body || node.properties.name,
            getLevel(urn, rootNodeType, node.properties.id, node.labels[0])
          )
      );
    const edges: Edge[] = res.records[0]
      .get("relationships")
      .filter(edge => neoIdToNodeId[edge.start] && neoIdToNodeId[edge.end])
      .map(
        edge =>
          new Edge({
            source: neoIdToNodeId[edge.start],
            destination: neoIdToNodeId[edge.end],
            type: edge.type,
            salience: edge.properties.salience
          })
      );
    return new Graph(nodes, edges);
  });
}

function getLevel(
  startId: string,
  startType: string,
  nodeId: string,
  nodeType: string
): number {
  if (startId === nodeId) {
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
      RETURN c,weight,r,n`
      : `MATCH (c:Capture)<-[created:CREATED]-(u:User {id:"${userId}"})
      WITH c
      SKIP ${start} LIMIT ${count}
      OPTIONAL MATCH (c)-[r]->(n)
      RETURN c,r,n`;

  return executeQuery(cypherQuery).then(res => {
    return buildSearchResults(res.records, start, count);
  });
}

function buildSearchResults(records, start, count) {
  return new SearchResults(
    buildGraph(records, start, count),
    new PageInfo(start, count, start + count)
  );
}

function buildGraph(records, start, count) {
  const captures: GraphNode[] = records.map(
    record =>
      new GraphNode(
        record.get("c").properties.id,
        "Capture",
        record.get("c").properties.body,
        0
      )
  );
  const dedupedCaptures: GraphNode[] = dedupe(captures, capture => capture.id);

  const entities: GraphNode[] = records
    .filter(
      record => record.get("n") && record.get("n").labels.includes("Entity")
    )
    .map(
      record =>
        new GraphNode(
          record.get("n").properties.id,
          "Entity",
          record.get("n").properties.name,
          1
        )
    );
  const dedupedEntities: GraphNode[] = dedupe(entities, entity => entity.id);

  const tags: GraphNode[] = records
    .filter(record => {
      return record.get("n") && record.get("n").labels.includes("Tag");
    })
    .map(
      record =>
        new GraphNode(
          record.get("n").properties.id,
          "Tag",
          record.get("n").properties.name,
          1
        )
    );
  const dedupedTags: GraphNode[] = dedupe(tags, tag => tag.id);

  const edges: Edge[] = records
    .filter(record => record.get("r"))
    .map(record => {
      return new Edge({
        source: record.get("c").properties.id,
        destination: record.get("n").properties.id,
        type: record.get("r").type,
        salience: record.get("r").properties.salience
      });
    });
  return new Graph(
    dedupedCaptures.concat(dedupedEntities.concat(dedupedTags)),
    edges
  );
}
