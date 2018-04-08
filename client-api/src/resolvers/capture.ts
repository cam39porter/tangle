import {
  PageInfo,
  Capture,
  CaptureCollection,
  Tag,
  NLPResponse,
  SearchResults,
  Entity,
  Graph,
  GraphEdge
} from "../models";
import { db } from "../db/db";
import { getNLPResponse } from "../services/nlp";
import { execute } from "../db/graphdb";

const table = "capture";

let cachedNLP;

export default {
  Query: {
    getCaptures(_, params, context): Promise<CaptureCollection> {
      return getAll()
        .then(warmNLPCache)
        .then(captures => {
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
      return search(params.rawQuery)
        .then(warmNLPCache)
        .then(captures => {
          return new SearchResults({ graph: buildGraph(captures, cachedNLP) });
        });
    }
  },
  Mutation: {
    createCapture(_, params, context): Promise<Graph> {
      return insert(params.body).then(() =>
        getAll().then(captures => {
          const graph = buildGraph(captures, cachedNLP);
          cachedNLP = undefined;
          return graph;
        })
      );
    }
  }
};

function buildGraph(captures: Capture[], nlp: NLPResponse): Graph {
  const joinedCaptures = captures.map(capture => capture.body).join("/n");
  const dedupe = require("dedupe");
  const entities: Entity[] = nlp.entities
    .filter(entity => joinedCaptures.includes(entity.name))
    .map(
      nlpEntity =>
        new Entity({
          id: `${nlpEntity.name};${nlpEntity.type}`,
          name: nlpEntity.name,
          type: nlpEntity.type
        })
    );
  const dedupedEntites: Entity[] = dedupe(entities, entity => entity.id);
  const edges: GraphEdge[][] = dedupedEntites.map(entity => {
    let localEdges: GraphEdge[] = [];
    captures.forEach(capture => {
      if (capture.body.includes(entity.name)) {
        localEdges.push(
          new GraphEdge({
            source: capture.id,
            destination: entity.id
          })
        );
      }
    });
    return localEdges;
  });

  return new Graph({
    captures: captures,
    entities: dedupedEntites,
    edges: [].concat(...edges)
  });
}

function warmNLPCache(ret) {
  if (!cachedNLP) {
    return buildNLP()
      .then(nlpResp => (cachedNLP = nlpResp))
      .then(nll => ret);
  } else {
    return ret;
  }
}

function buildNLP(): Promise<NLPResponse> {
  return getAll()
    .then(captures => captures.map(capture => capture.body).join("\n"))
    .then(joinedCapture => getNLPResponse(joinedCapture));
}

function insert(body: string): Promise<string> {
  return execute(`CREATE (n:Capture {body:"${body}", created:TIMESTAMP()})`);
}

function get(id: string): Promise<Capture> {
  return db
    .select()
    .from(table)
    .where("ID", id)
    .then(format);
}

function getAll(): Promise<[Capture]> {
  return execute("MATCH (n) RETURN n").then(result => {
    return result.records.map(record => {
      return new Capture({
        id: record.get("n").identity.toString(),
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
