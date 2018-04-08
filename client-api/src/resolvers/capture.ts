import {
  PageInfo,
  Capture,
  CaptureCollection,
  Tag,
  NLPEntityResponse,
  SearchResults,
  Entity,
  Graph,
  GraphEdge,
  NLPEntity
} from "../models";
import { db } from "../db/db";
import { getNLPResponse } from "../services/nlp";
import { execute } from "../db/graphdb";

const table = "capture";
const uuidv4 = require("uuid/v4");

let cachedNLP;

export default {
  Query: {
    getCaptures(_, params, context): Promise<CaptureCollection> {
      return getAll().then(captures => {
        return page(captures, params.start, params.count);
      });
    },
    getCapture(_, params, context): Promise<Capture> {
      return get(params.id);
    },
    search(_, params, context): Promise<CaptureCollection> {
      return search(params.rawQuery).then(captures =>
        page(captures, params.start, params.count)
      );
    },
    searchv2(_, params, context): Promise<SearchResults> {
      return search(params.rawQuery).then(captures => {
        return new SearchResults({
          graph: buildGraph(captures)
        });
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
            return new Graph({});
          });
        });
      });
    }
  }
};

function createNLPResponse(body: string) {}

function buildGraph(captures: Capture[]): Graph {
  const joinedCaptures = captures.map(capture => capture.body).join("/n");
  const dedupe = require("dedupe");
  // const entities: Entity[] = nlp.entities
  //   .filter(entity => joinedCaptures.includes(entity.name))
  //   .map(
  //     nlpEntity =>
  //       new Entity({
  //         id: `${nlpEntity.name};${nlpEntity.type}`,
  //         name: nlpEntity.name,
  //         type: nlpEntity.type
  //       })
  //   );
  // const dedupedEntites: Entity[] = dedupe(entities, entity => entity.id);
  // const edges: GraphEdge[][] = dedupedEntites.map(entity => {
  //   let localEdges: GraphEdge[] = [];
  //   captures.forEach(capture => {
  //     if (capture.body.includes(entity.name)) {
  //       localEdges.push(
  //         new GraphEdge({
  //           source: capture.id,
  //           destination: entity.id
  //         })
  //       );
  //     }
  //   });
  //   return localEdges;
  // });

  return new Graph({
    captures: captures,
    entities: [],
    edges: []
  });
}

function insertEntityWithRel(
  captureId: number,
  entity: NLPEntity
): Promise<any> {
  return execute(`
    MATCH (capture) WHERE ID(capture) = ${captureId}
    MERGE (entity:Entity {
      id: "${entity.name}";"${entity.type}",
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

function get(id: string): Promise<Capture> {
  return db
    .select()
    .from(table)
    .where("ID", id)
    .then(format);
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

function search(rawQuery: string): Promise<[Capture]> {
  return db
    .raw(
      `SELECT * FROM capture WHERE MATCH(body) AGAINST('${rawQuery}' IN NATURAL LANGUAGE MODE)`
    )
    .then(arr => arr[0])
    .then(formatAll);
}

function format(arr): Capture {
  return new Capture(arr[0]);
}

function formatAll(arr) {
  return arr.map(dao => new Capture(dao));
}

function page(
  captures: [Capture],
  start: number,
  count: number
): CaptureCollection {
  const collection: CaptureCollection = new CaptureCollection(
    // TODO cole move paging to mysql
    captures.slice(start, start + count),
    new PageInfo(start, count, captures.length)
  );
  return collection;
}
