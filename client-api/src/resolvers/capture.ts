import { PageInfo, Capture, CaptureCollection } from "../models";
import { knex } from "../db/db";

const table = "capture";

function insert(capture: Capture): Promise<string> {
  return knex(table)
    .insert(capture)
    .returning("ID")
    .then(idArr => idArr[0]);
}

function get(id: string): Promise<Capture> {
  return knex
    .select()
    .from(table)
    .where("ID", id)
    .then(format);
}

function search(rawQuery: string) {
  return knex
    .raw(
      `SELECT * FROM capture WHERE MATCH(body) AGAINST('${rawQuery}' IN NATURAL LANGUAGE MODE) ORDER BY created DESC`
    )
    .then(formatAll);
}

function format(arr): Capture {
  return new Capture(arr[0]);
}

function formatAll(arr) {
  return arr[0].map(dao => new Capture(dao));
}

export default {
  Query: {
    getCaptures(): Promise<Capture[]> {
      return knex
        .select()
        .from(table)
        .orderBy("created", "desc")
        .then(formatAll);
    },
    getCapture(_, params, context): Promise<Capture> {
      return get(params.id);
    },
    search(_, params, context): Promise<Capture> {
      return search(params.rawQuery).then(captures => {
        const collection: CaptureCollection = new CaptureCollection(
          // TODO cole move paging to mysql
          captures.slice(params.start, params.start + params.count),
          new PageInfo(params.start, params.count, captures.length)
        );
        return collection;
      });
    }
  },
  Mutation: {
    createCapture(_, params, context): Promise<Capture> {
      const capture = new Capture(params);
      return insert(capture).then(id => get(id));
    }
  }
};
