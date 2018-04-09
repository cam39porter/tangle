import {
  PageInfo,
  Capture,
  CaptureCollection,
  Tag,
  NLPEntityResponse,
  SearchResults,
  Entity,
  Graph,
  GraphNode,
  Edge,
  NLPEntity
} from "../models";
import { db } from "../db/db";
import { getNLPResponse } from "../services/nlp";
import { execute } from "../db/graphdb";
const uuidv4 = require("uuid/v4");
const dedupe = require("dedupe");

const table = "capture";

export default {
  Query: {
    search(_, params, context): Promise<SearchResults> {
      return search(params.rawQuery, params.start, params.count);
    },
    get(_, params, context): Promise<Graph> {
      return get(params.id);
    }
  },
  Mutation: {
    createCapture(_, params, context): Promise<Graph> {
      return insertCapture(params.body).then(capture => {
        const id =
          capture.records[0].get("n").properties.id ||
          capture.records[0].get("n").properties.created.toString();
        return getNLPResponse(params.body).then(nlp => {
          const promises = Promise.all(
            nlp.entities.map(entity => insertEntityWithRel(id, entity))
          );
          return promises.then(results => {
            return new Graph(null, null);
          });
        });
      });
    }
  }
};

function insertEntityWithRel(
  captureId: number,
  entity: NLPEntity
): Promise<any> {
  return execute(`
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

function insertCapture(body: string): Promise<any> {
  const uuid = uuidv4();
  return execute(
    `CREATE (n:Capture {id:"${uuid}", body:"${body}", created:TIMESTAMP()}) RETURN n`
  );
}

function get(id: string): Promise<Graph> {
  return execute(`
    MATCH (c:Capture {id:"${id}"}) 
    OPTIONAL MATCH (c)-[r:REFERENCES]->(e:Entity)
    RETURN c,r,e
  `).then(res => buildGraphFromNeo4jResp(res.records, 0, 1));
}
function getAll(): Promise<[Capture]> {
  return execute("MATCH (n:Capture) RETURN n").then(result => {
    return result.records.map(record => {
      return new Capture({
        id:
          record.get("n").properties.id ||
          record.get("n").properties.created.toString(),
        body: record.get("n").properties.body,
        created: record.get("n").properties.created.toString()
      });
    });
  });
}

function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SearchResults> {
  return execute(
    `MATCH (c:Capture) 
    WHERE c.body CONTAINS '${rawQuery}' 
    MATCH (c)-[r:REFERENCES]->(e:Entity)
    RETURN c,r,e`
  ).then(res => {
    return buildSearchResultsFromNeo4jResp(res.records, start, count);
  });
}

function buildSearchResultsFromNeo4jResp(records, start, count) {
  const captures: GraphNode[] = records.map(
    record =>
      new GraphNode(
        record.get("c").properties.id,
        "CAPTURE",
        record.get("c").properties.body,
        0
      )
  );
  const dedupedCaptures: GraphNode[] = dedupe(captures, capture => capture.id);
  const dedupedAndPagedCaptures = dedupedCaptures.slice(start, start + count);

  const pagedRecords = records.filter(record =>
    dedupedAndPagedCaptures
      .map(node => node.id)
      .includes(record.get("c").properties.id)
  );
  return new SearchResults(
    buildGraphFromNeo4jResp(pagedRecords, start, count),
    new PageInfo(start, count, dedupedCaptures.length)
  );
}

function buildGraphFromNeo4jResp(records, start, count) {
  const captures: GraphNode[] = records.map(
    record =>
      new GraphNode(
        record.get("c").properties.id,
        "CAPTURE",
        record.get("c").properties.body,
        0
      )
  );
  const dedupedCaptures: GraphNode[] = dedupe(captures, capture => capture.id);

  const entities: GraphNode[] = records.map(
    record =>
      new GraphNode(
        record.get("e").properties.id,
        "ENTITY",
        record.get("e").properties.name,
        1
      )
  );
  const dedupedEntities: GraphNode[] = dedupe(entities, entity => entity.id);
  const edges: Edge[] = records.map(
    record =>
      new Edge({
        source: record.get("c").properties.id,
        destination: record.get("e").properties.id,
        type: record.get("r").type,
        salience: record.get("r").properties.salience
      })
  );
  return new Graph(dedupedCaptures.concat(dedupedEntities), edges);
}
