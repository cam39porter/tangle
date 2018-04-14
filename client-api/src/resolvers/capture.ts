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

const dedupe = require("dedupe");
const table = "capture";

export default {
  Query: {
    search(_, params, context): Promise<SearchResults> {
      return search(params.rawQuery, params.start, params.count);
    },
    get(_, params, context): Promise<Graph> {
      return get(params.id);
    },
    getAll(_, params, context): Promise<SearchResults> {
      return getAll(params.timezoneOffset);
    }
  },
  Mutation: {
    createCapture(_, params, context): Promise<Graph> {
      const user: User = getAuthenticatedUser();
      return createCaptureNode(user, params.body).then(
        (captureNode: GraphNode) => {
          return getNLPResponse(stripTags(params.body)).then(nlp => {
            const nlpCreates = Promise.all(
              nlp.entities.map(entity =>
                insertEntityWithRel(captureNode.id, entity)
              )
            );
            return nlpCreates.then(nlpCreateResults => {
              const tagCreates = Promise.all(
                parseTags(params.body).map(tag =>
                  createTagNodeWithEdge(tag, captureNode.id)
                )
              );
              return tagCreates.then(tagCreateResults => {
                return get(captureNode.id);
              });
            });
          });
        }
      );
    }
  }
};

function insertEntityWithRel(
  captureId: string,
  entity: NLPEntity
): Promise<any> {
  return executeQuery(`
    MATCH (capture {id: "${captureId}"})
    MERGE (entity:Entity {
      id: "${entity.name};${entity.type}",
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

function get(id: string): Promise<Graph> {
  return executeQuery(`MATCH (c {id:"${id}"}) 
  CALL apoc.path.subgraphAll(c, {maxLevel:2, labelFilter:"-User"}) yield nodes, relationships
  RETURN nodes,relationships`).then(res => {
    const neoIdToNodeId = _.mapValues(
      _.keyBy(res.records[0].get("nodes"), "identity"),
      "properties.id"
    );

    const nodes: GraphNode[] = res.records[0]
      .get("nodes")
      .map(
        node =>
          new GraphNode(
            node.properties.id,
            node.labels[0],
            node.properties.body || node.properties.name,
            getLevel(id, node.properties.id, node.labels[0])
          )
      );
    const edges: Edge[] = res.records[0].get("relationships").map(
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

function getLevel(startId: string, nodeId: string, nodeType: string): number {
  if (startId === nodeId) {
    return 0;
  } else if (nodeType !== "Capture") {
    return 1;
  } else {
    return 2;
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
