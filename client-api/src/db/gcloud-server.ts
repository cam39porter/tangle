import Knex from "knex";
import devcfg from "../cfg/devcfg";
import { Capture } from "../models/capture";
const config = {
  user: process.env.MYSQL_USER || devcfg.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || devcfg.MYSQL_PASSWORD,
  database: process.env.DATABASE || devcfg.DATABASE,
  socketPath: null
};

if (process.env.NODE_ENV === "production") {
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
