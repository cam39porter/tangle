import {
  PageInfo,
  Capture,
  CaptureCollection,
  Tag,
  NLPEntityResponse,
  SearchResults,
  Entity,
  Graph,
  Node,
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
      return search(params.rawQuery).then(graph => {
        return new SearchResults(graph);
      });
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

function search(rawQuery: string): Promise<Graph> {
  return execute(
    `MATCH (c:Capture) 
    WHERE c.body CONTAINS '${rawQuery}' 
    MATCH (c)-[r:REFERENCES]->(e:Entity)
    RETURN c,r,e`
  ).then(res => {
    const captures = res.records.map(
      record =>
        new Node(
          record.get("c").properties.id ||
            record.get("c").properties.created.toString(),
          "CAPTURE",
          record.get("c").properties.body
        )
    );
    const dedupedCaptures = dedupe(captures, capture => capture.id);
    const entities = res.records.map(
      record =>
        new Node(
          record.get("e").properties.id ||
            record.get("e").properties.name +
              ";" +
              record.get("e").properties.type,
          "ENTITY",
          record.get("e").properties.name
        )
    );
    const dedupedEntities = dedupe(entities, entity => entity.id);
    const edges = res.records.map(
      record =>
        new Edge({
          source:
            record.get("c").properties.id ||
            record.get("c").properties.created.toString(),
          destination:
            record.get("e").properties.id ||
            record.get("e").properties.name +
              ";" +
              record.get("e").properties.type,
          type: record.get("r").type,
          salience: record.get("r").properties.salience
        })
    );
    return new Graph(dedupedCaptures.concat(dedupedEntities), edges);
  });
}
