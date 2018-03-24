import { PageInfo, Capture, CaptureCollection } from "../models";
import { knex } from "../db/db";

const table = "capture";

export default {
  Query: {
    getCaptures(_, params, context): Promise<CaptureCollection> {
      return getAll().then(captures =>
        page(captures, params.start, params.count)
      );
    },
    getCapture(_, params, context): Promise<Capture> {
      return get(params.id);
    },
    search(_, params, context): Promise<CaptureCollection> {
      return search(params.rawQuery).then(captures =>
        page(captures, params.start, params.count)
      );
    }
  },
  Mutation: {
    createCapture(_, params, context): Promise<Capture> {
      const capture = new Capture(params);
      return insert(capture).then(get);
    }
  }
};

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

function getAll(): Promise<[Capture]> {
  return knex
    .select()
    .from(table)
    .orderBy("created", "desc")
    .then(formatAll);
}

function search(rawQuery: string): Promise<[Capture]> {
  return knex
    .raw(
      `SELECT * FROM capture WHERE MATCH(body) AGAINST('${rawQuery}' IN NATURAL LANGUAGE MODE) ORDER BY created DESC`
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
