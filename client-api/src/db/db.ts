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

let db = require("knex")({
  client: "mysql",
  connection: config
});

export { db };
