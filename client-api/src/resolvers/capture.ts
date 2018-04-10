import {
  PageInfo,
  NLPEntityResponse,
  SearchResults,
  Graph,
  GraphNode,
  Edge,
  NLPEntity
} from "../models";
import { getNLPResponse } from "../services/nlp";
import { executeQuery, createNode } from "../db/db";
import { parseTags, stripTags } from "../helpers/tag";
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
      return insertCapture(params.body).then(captureNode => {
        const id = captureNode.id;
        return getNLPResponse(stripTags(params.body)).then(nlp => {
          const nlpCreates = Promise.all(
            nlp.entities.map(entity => insertEntityWithRel(id, entity))
          );
          return nlpCreates.then(nlpCreateResults => {
            const tagCreates = Promise.all(
              parseTags(params.body).map(tag => insertTagWithRel(id, tag))
            );
            return tagCreates.then(tagCreateResults => {
              return get(id);
            });
          });
        });
      });
    }
  }
};

function insertTagWithRel(captureId: string, tag: string) {
  return executeQuery(`
    MATCH (capture {id: "${captureId}"})
    MERGE (tag:Tag {
      id: "${tag}",
      name: "${tag}"
    })
    CREATE (tag)<-[r:TAGGED_WITH]-(capture)
    RETURN tag
  `);
}

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

function insertCapture(body: string): Promise<GraphNode> {
  const uuid = uuidv4();
  return createNode(new GraphNode(uuid, "Capture", body, null));
}

function get(id: string): Promise<Graph> {
  return executeQuery(`
    MATCH (c:Capture {id:"${id}"}) 
    OPTIONAL MATCH (c)-[r]->(n)
    RETURN c,r,n
  `).then(res => buildGraphFromNeo4jResp(res.records, 0, 1));
}

function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SearchResults> {
  return executeQuery(
    `MATCH (c:Capture) 
    WHERE c.body CONTAINS '${rawQuery}' 
    OPTIONAL MATCH (c)-[r]->(n)
    RETURN c,r,n`
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

  const entities: GraphNode[] = records
    .filter(
      record => record.get("n") && record.get("n").labels.includes("Entity")
    )
    .map(
      record =>
        new GraphNode(
          record.get("n").properties.id,
          "ENTITY",
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
          "TAG",
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
