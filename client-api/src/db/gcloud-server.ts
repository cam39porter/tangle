import Knex from "knex";
import sqlcfg from "../cfg/sql";
import { Capture } from "../models/capture";
const config = {
  user: sqlcfg.MYSQL_USER,
  password: sqlcfg.MYSQL_PASSWORD,
  database: sqlcfg.DATABASE,
  socketPath: null
};

if (
  process.env.INSTANCE_CONNECTION_NAME &&
  process.env.NODE_ENV === "production"
) {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

let knex = require("knex")({
  client: "mysql",
  connection: config
});

/**
 * Insert a visit record into the database.
 *
 * @param {object} knex The Knex connection object.
 * @param {object} capture The visit record to insert.
 * @returns {Promise}
 */
function insertCapture(capture: Capture): Capture {
  return knex("capture")
    .insert(capture)
    .returning("id")
    .then(id => {
      capture.id = id[0];
      return capture;
    });
}

/**
 * Insert a visit record into the database.
 *
 * @param {object} knex The Knex connection object.
 * @param {object} capture The visit record to insert.
 * @returns {Promise}
 */
function getCapture(id: string) {
  return knex
    .select("body", "id")
    .from("capture")
    .where("id", id)
    .then(arr => arr[0]);
}

/**
 * Retrieve the latest 10 visit records from the database.
 *
 * @param {object} knex The Knex connection object.
 * @returns {Promise}
 */
function getCaptures() {
  return knex
    .select("body", "id")
    .from("capture")
    .limit(10);
}

export { insertCapture, getCapture, getCaptures };
